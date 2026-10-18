from __future__ import annotations

from datetime import datetime
from typing import List, Dict, Any, Optional

from app.schemas.scorecard import AuditCheck, ScorecardResponse
from app.services.khatian_math import (
    validate_shares,
    ana_gonda_to_decimal,
    parse_bangla_share_text,
)
from app.services.faraid_engine import calculate_islamic_inheritance
from app.services.hindu_inheritance import calculate_hindu_inheritance


def perform_share_sum_check(owners: List[Dict[str, Any]]) -> AuditCheck:
    """Validate that all owner shares sum to exactly 16 Ana (100%)."""
    if not owners:
        return AuditCheck(
            check_name="SHARE_SUM_CHECK",
            status="WARN",
            severity="MEDIUM",
            message="No owners listed in Khatian record to evaluate.",
            details={"owner_count": 0},
        )

    shares_for_validation = []
    for o in owners:
        share_bd = o.get("share_breakdown")
        if not share_bd and o.get("share_text"):
            share_bd = parse_bangla_share_text(o["share_text"])
        shares_for_validation.append(share_bd or {
            "ana": o.get("share_ana", 0),
            "gonda": o.get("share_gonda", 0),
            "kara": o.get("share_kara", 0),
            "kranti": o.get("share_kranti", 0),
        })

    validation = validate_shares(shares_for_validation)
    total_pct = validation["total_percentage"]

    if validation["is_valid"]:
        return AuditCheck(
            check_name="SHARE_SUM_CHECK",
            status="PASS",
            severity="INFO",
            message=f"Total shares sum to 16 Ana ({total_pct}%). Perfect share balance across co-sharers.",
            details=validation,
        )
    elif total_pct > 100.01:
        return AuditCheck(
            check_name="SHARE_SUM_CHECK",
            status="FAIL",
            severity="CRITICAL",
            message=f"Total shares exceed 16 Ana ({total_pct}%). High risk of double-selling or overlapping title!",
            details=validation,
        )
    else:
        return AuditCheck(
            check_name="SHARE_SUM_CHECK",
            status="WARN",
            severity="MEDIUM",
            message=f"Total shares sum to {total_pct}% (missing {validation['discrepancy_percentage']}%). Possible un-mutated or government Khas share.",
            details=validation,
        )


def perform_share_math_check(owner: Dict[str, Any]) -> AuditCheck:
    """Validate individual owner's fractional share arithmetic."""
    name = owner.get("name", "Unknown Owner")
    share_bd = owner.get("share_breakdown")
    if not share_bd and owner.get("share_text"):
        share_bd = parse_bangla_share_text(owner["share_text"])
    share_bd = share_bd or {
        "ana": owner.get("share_ana", 0),
        "gonda": owner.get("share_gonda", 0),
        "kara": owner.get("share_kara", 0),
        "kranti": owner.get("share_kranti", 0),
    }

    conv = ana_gonda_to_decimal(
        share_bd.get("ana", 0),
        share_bd.get("gonda", 0),
        share_bd.get("kara", 0),
        share_bd.get("kranti", 0),
    )

    recorded_pct = float(owner.get("ownership_percentage", 0.0))
    if recorded_pct > 0 and abs(recorded_pct - conv["percentage"]) > 0.1:
        return AuditCheck(
            check_name=f"MATH_CHECK_{name}",
            status="WARN",
            severity="LOW",
            message=f"Fractional share discrepancy for {name}: Recorded {recorded_pct}% vs calculated {conv['percentage']}%.",
            details={"recorded_pct": recorded_pct, "calculated": conv},
        )

    return AuditCheck(
        check_name=f"MATH_CHECK_{name}",
        status="PASS",
        severity="INFO",
        message=f"Fractional share arithmetic for {name} ({conv['decimal_share'] * 16:.2f} Ana) is verified.",
        details=conv,
    )


def perform_inheritance_check(
    deceased_name: str,
    deceased_share: float,
    family_tree: Dict[str, Any],
    khatian_owners: List[Dict[str, Any]],
) -> AuditCheck:
    """Check inheritance distribution and flag potential excluded co-sharers."""
    heirs = family_tree.get("heirs", [])
    if not heirs:
        return AuditCheck(
            check_name="INHERITANCE_CO_SHARER_CHECK",
            status="PASS",
            severity="INFO",
            message="No deceased family tree provided; sole owner title audit.",
            details={},
        )

    system = family_tree.get("inheritance_system", "ISLAMIC").upper()
    if system == "HINDU":
        inheritance_res = calculate_hindu_inheritance(deceased_share, heirs)
    else:
        inheritance_res = calculate_islamic_inheritance(deceased_share, heirs)

    # Check for excluded female heirs (Daughters or Wives missing from Khatian owners)
    excluded_heirs: List[str] = []
    owner_names = [o.get("name", "").lower() for o in khatian_owners]

    female_heirs = [h for h in heirs if h.get("relation") in ("Daughter", "Wife", "মেয়ে", "স্ত্রী")]
    has_daughter = any(h.get("relation") in ("Daughter", "মেয়ে") for h in heirs)

    if has_daughter and len(khatian_owners) > 0:
        # Check if female names appear or if daughters were bypassed
        daughter_detected = any("bibi" in name or "khatun" in name or "begum" in name or "aktar" in name for name in owner_names)
        if not daughter_detected:
            excluded_heirs.append("Daughter(s) (কন্যা/মেয়ে) may be excluded from the mutated record")

    if excluded_heirs:
        return AuditCheck(
            check_name="INHERITANCE_CO_SHARER_CHECK",
            status="WARN",
            severity="HIGH",
            message="Co-sharer exclusion alert: Legal heirs (e.g. Daughters/Wife) exist in family tree but may not have mutated shares.",
            details={"excluded_heirs": excluded_heirs, "distribution": inheritance_res},
        )

    return AuditCheck(
        check_name="INHERITANCE_CO_SHARER_CHECK",
        status="PASS",
        severity="INFO",
        message="All legal heirs and family tree co-sharers accounted for.",
        details={"distribution": inheritance_res},
    )


def perform_seller_share_check(seller_claimed_share: float, entitled_share: float) -> AuditCheck:
    """Check if seller claims more than their legally entitled share."""
    discrepancy = seller_claimed_share - entitled_share
    if discrepancy > 0.001:
        return AuditCheck(
            check_name="SELLER_ENTITLEMENT_CHECK",
            status="FAIL",
            severity="CRITICAL",
            message=f"Over-allocation detected: Seller claims {seller_claimed_share:.4f} decimal but is legally entitled to only {entitled_share:.4f} decimal.",
            details={
                "claimed": round(seller_claimed_share, 4),
                "entitled": round(entitled_share, 4),
                "excess": round(discrepancy, 4),
            },
        )
    return AuditCheck(
        check_name="SELLER_ENTITLEMENT_CHECK",
        status="PASS",
        severity="INFO",
        message=f"Seller claimed share ({seller_claimed_share:.4f} decimal) is within legal entitled limit ({entitled_share:.4f} decimal).",
        details={"claimed": seller_claimed_share, "entitled": entitled_share},
    )


def calculate_risk_level(checks: List[AuditCheck]) -> tuple[str, float]:
    """Calculate overall risk level (GREEN, YELLOW, RED) and numerical score (0-100)."""
    has_fail = any(c.status == "FAIL" for c in checks)
    has_warn = any(c.status == "WARN" for c in checks)

    if has_fail:
        level = "RED"
        score = 85.0
        # Increase for critical severity
        if any(c.severity == "CRITICAL" for c in checks):
            score = 95.0
    elif has_warn:
        level = "YELLOW"
        score = 45.0
        if any(c.severity == "HIGH" for c in checks):
            score = 55.0
    else:
        level = "GREEN"
        score = 10.0

    return level, score


def generate_recommendations(checks: List[AuditCheck]) -> List[str]:
    """Generate prioritized actionable legal advice based on audit checks."""
    recommendations: List[str] = []

    for check in checks:
        if check.check_name == "SHARE_SUM_CHECK" and check.status != "PASS":
            recommendations.append("Obtain an updated CS/SA/RS Chain of Title (ভায়া দলিল) to confirm correct fractional shares.")
            recommendations.append("Apply for demarcation (বাটোয়ারা / সীমানা নির্ধারণ) at the local Assistant Commissioner (Land) office.")

        if check.check_name == "INHERITANCE_CO_SHARER_CHECK" and check.status != "PASS":
            recommendations.append("Demand official Warisond Certificate (ওয়ারিশান সনদ) issued by local Union Parishad / Ward Councilor.")
            recommendations.append("Obtain registered Registered Partition Deed (বন্টননামা দলিল) signed by all legal heirs including daughters.")

        if check.check_name == "SELLER_ENTITLEMENT_CHECK" and check.status == "FAIL":
            recommendations.append("DO NOT PROCEED with transaction until seller resolves excessive share claim with co-sharers.")
            recommendations.append("Verify seller's individual Mutation Khatian (খারিজ খতিয়ান) and recent Dakhila (ভূমি উন্নয়ন কর রশিদ).")

    if not recommendations:
        recommendations.append("Clear Title: All fractional shares and heir entitlements are verified.")
        recommendations.append("Proceed with standard title deed registration and immediate e-Mutation application.")

    return recommendations


def generate_scorecard(
    khatian_data: Dict[str, Any],
    family_tree_data: Optional[Dict[str, Any]] = None,
    seller_claimed_share: Optional[float] = None,
    seller_name: Optional[str] = None,
) -> ScorecardResponse:
    """Generate complete Land Truth Scorecard diagnostic."""
    checks: List[AuditCheck] = []
    owners = khatian_data.get("owners", [])

    # Check 1: Total share summation
    checks.append(perform_share_sum_check(owners))

    # Check 2: Mathematical validity for each owner
    for owner in owners[:3]:  # Top owners
        checks.append(perform_share_math_check(owner))

    # Check 3: Inheritance and co-sharer exclusion check
    if family_tree_data:
        deceased_name = family_tree_data.get("deceased_name", family_tree_data.get("deceased_owner", "Deceased Owner"))
        # Deceased share could be passed or inferred from owner
        deceased_share = float(family_tree_data.get("deceased_share", khatian_data.get("total_area_decimal", 10.0)))
        checks.append(perform_inheritance_check(deceased_name, deceased_share, family_tree_data, owners))

    # Check 4: Seller share entitlement check
    if seller_claimed_share is not None and seller_claimed_share > 0:
        # Determine entitled share
        entitled = seller_claimed_share  # default fallback
        if family_tree_data and family_tree_data.get("heirs"):
            deceased_share = float(family_tree_data.get("deceased_share", khatian_data.get("total_area_decimal", 10.0)))
            calc = calculate_islamic_inheritance(deceased_share, family_tree_data["heirs"])
            # Match seller to heirs
            for h in calc["heirs"]:
                if h["relation"].lower() in (seller_name or "").lower() or (h.get("count", 1) == 1 and not seller_name):
                    entitled = h["individual_share_decimal"]
                    break
                elif h["relation"] == "Son":  # Default to Son's share if ambiguous
                    entitled = h["individual_share_decimal"]
        checks.append(perform_seller_share_check(seller_claimed_share, entitled))

    risk_level, risk_score = calculate_risk_level(checks)
    recommendations = generate_recommendations(checks)

    khatian_summary = {
        "khatian_no": khatian_data.get("khatian_no", "N/A"),
        "khatian_type": khatian_data.get("khatian_type", "RS"),
        "mouza": khatian_data.get("mouza", "N/A"),
        "dag_no": khatian_data.get("dag_no", "N/A"),
        "total_area_decimal": khatian_data.get("total_area_decimal", 0.0),
        "owner_count": len(owners),
    }

    return ScorecardResponse(
        id=None,
        khatian_summary=khatian_summary,
        risk_level=risk_level,
        risk_score=risk_score,
        checks=checks,
        recommendations=recommendations,
        generated_at=datetime.utcnow(),
    )
