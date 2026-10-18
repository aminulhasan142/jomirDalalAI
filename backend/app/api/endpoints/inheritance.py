from __future__ import annotations

from typing import List
from fastapi import APIRouter, status

from app.schemas.inheritance import (
    InheritanceRequest,
    InheritanceResponse,
    InheritanceAuditRequest,
    InheritanceAuditResponse,
)
from app.services.faraid_engine import calculate_islamic_inheritance
from app.services.hindu_inheritance import calculate_hindu_inheritance

router = APIRouter(prefix="/inheritance", tags=["Inheritance & Farai'd Audit"])


@router.post("/calculate", response_model=InheritanceResponse, status_code=status.HTTP_200_OK)
def calculate_inheritance(req: InheritanceRequest) -> InheritanceResponse:
    """Calculate legal heir shares under Islamic Farai'd or Hindu Dayabhaga inheritance law."""
    heirs_dicts = [h.model_dump() for h in req.heirs]
    system = req.inheritance_system.upper()

    if system == "HINDU":
        result = calculate_hindu_inheritance(req.deceased_share, heirs_dicts)
    else:
        result = calculate_islamic_inheritance(req.deceased_share, heirs_dicts)

    return InheritanceResponse(**result)


@router.post("/audit", response_model=InheritanceAuditResponse, status_code=status.HTTP_200_OK)
def audit_inheritance(req: InheritanceAuditRequest) -> InheritanceAuditResponse:
    """
    Audit seller's claimed share against legal inheritance entitlement.
    Detects un-mutated shares, over-allocation, and illegally excluded co-sharers.
    """
    heirs_dicts = [h.model_dump() for h in req.heirs]
    system = req.inheritance_system.upper()

    if system == "HINDU":
        calc = calculate_hindu_inheritance(req.deceased_total_share, heirs_dicts)
    else:
        calc = calculate_islamic_inheritance(req.deceased_total_share, heirs_dicts)

    # Find seller's entitled share
    seller_rel = (req.seller_relation or "").strip().lower()
    entitled_share = 0.0
    found_seller = False

    for heir_group in calc["heirs"]:
        if seller_rel and heir_group["relation"].lower() == seller_rel:
            entitled_share = heir_group["individual_share_decimal"]
            found_seller = True
            break

    # If seller relation not matched or not provided, assume Son by default if present
    if not found_seller:
        for heir_group in calc["heirs"]:
            if heir_group["relation"] == "Son":
                entitled_share = heir_group["individual_share_decimal"]
                found_seller = True
                break
        if not found_seller and calc["heirs"]:
            entitled_share = calc["heirs"][0]["individual_share_decimal"]

    discrepancy = round(req.seller_claimed_share - entitled_share, 4)
    is_valid = discrepancy <= 0.001

    # Check for excluded heirs (e.g. Daughters or Wives)
    excluded_heirs: List[str] = []
    warnings: List[str] = list(calc.get("warnings", []))

    for heir_group in calc["heirs"]:
        rel = heir_group["relation"]
        # If seller claims full deceased share or more than entitled, all other heirs are excluded!
        if req.seller_claimed_share > entitled_share and rel.lower() != seller_rel:
            excluded_heirs.append(f"{rel} ({heir_group['count']} person, entitled to {heir_group['share_decimal']} decimal)")

    if not is_valid:
        risk_level = "RED"
        warnings.append(
            f"Seller claimed share ({req.seller_claimed_share} decimal) exceeds legal entitled share ({entitled_share} decimal) by {discrepancy} decimal."
        )
    elif excluded_heirs:
        risk_level = "YELLOW"
        warnings.append("Co-sharers have legal inheritance rights that must be satisfied via partition deed (বন্টননামা).")
    else:
        risk_level = "GREEN"

    return InheritanceAuditResponse(
        seller_entitled_share=round(entitled_share, 4),
        seller_claimed_share=round(req.seller_claimed_share, 4),
        is_valid=is_valid,
        discrepancy=discrepancy,
        risk_level=risk_level,
        excluded_heirs=excluded_heirs,
        warnings=warnings,
    )
