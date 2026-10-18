from __future__ import annotations

from fractions import Fraction
from typing import List, Dict, Any


def calculate_islamic_inheritance(deceased_total_share: float, heirs: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Calculate Islamic inheritance shares according to Hanafi Farai'd law.

    Args:
        deceased_total_share: Total share or land decimal owned by the deceased.
        heirs: List of heir dictionaries, e.g.:
               [{"relation": "Wife", "count": 1}, {"relation": "Son", "count": 2}, {"relation": "Daughter", "count": 1}]

    Valid relations:
        - "Wife" / "স্ত্রী"
        - "Husband" / "স্বামী"
        - "Mother" / "মা"
        - "Father" / "বাবা"
        - "Son" / "ছেলে"
        - "Daughter" / "মেয়ে"
    """
    # Normalize relation names
    relation_aliases = {
        "wife": "Wife", "wives": "Wife", "স্ত্রী": "Wife",
        "husband": "Husband", "স্বামী": "Husband",
        "mother": "Mother", "মা": "Mother", "মাতা": "Mother",
        "father": "Father", "বাবা": "Father", "পিতা": "Father",
        "son": "Son", "sons": "Son", "ছেলে": "Son", "পুত্র": "Son",
        "daughter": "Daughter", "daughters": "Daughter", "মেয়ে": "Daughter", "কন্যা": "Daughter",
    }

    counts: Dict[str, int] = {}
    for h in heirs:
        rel_raw = str(h.get("relation", "")).strip().lower()
        rel = relation_aliases.get(rel_raw, h.get("relation", "").capitalize())
        cnt = int(h.get("count", 1))
        if cnt > 0:
            counts[rel] = counts.get(rel, 0) + cnt

    num_wives = counts.get("Wife", 0)
    num_husbands = counts.get("Husband", 0)
    num_mothers = counts.get("Mother", 0)
    num_fathers = counts.get("Father", 0)
    num_sons = counts.get("Son", 0)
    num_daughters = counts.get("Daughter", 0)

    warnings: List[str] = []

    # Validation
    if num_wives > 0 and num_husbands > 0:
        warnings.append("Both Husband and Wife are listed as surviving heirs of the same deceased.")
    if num_wives > 4:
        warnings.append(f"Number of wives ({num_wives}) exceeds legal Islamic limit of 4.")
    if num_fathers > 1:
        warnings.append(f"More than one father ({num_fathers}) listed.")
    if num_mothers > 1:
        warnings.append(f"More than one mother ({num_mothers}) listed.")

    has_children = (num_sons + num_daughters) > 0

    # Fractions dictionary for heir groups
    fixed_shares: Dict[str, Fraction] = {}

    # 1. Spouse Share
    if num_wives > 0:
        # 1/8 if children exist, 1/4 if no children
        fixed_shares["Wife"] = Fraction(1, 8) if has_children else Fraction(1, 4)
    elif num_husbands > 0:
        # 1/4 if children exist, 1/2 if no children
        fixed_shares["Husband"] = Fraction(1, 4) if has_children else Fraction(1, 2)

    # 2. Mother Share
    if num_mothers > 0:
        # 1/6 if children exist, 1/3 if no children
        fixed_shares["Mother"] = Fraction(1, 6) if has_children else Fraction(1, 3)

    # 3. Father Share (Fixed part)
    if num_fathers > 0:
        if num_sons > 0:
            fixed_shares["Father"] = Fraction(1, 6)
        elif num_daughters > 0:
            # 1/6 fixed + will take residual later
            fixed_shares["Father"] = Fraction(1, 6)
        else:
            # No children: Father takes all residual; fixed_shares["Father"] = 0 for now
            fixed_shares["Father"] = Fraction(0, 1)

    # 4. Daughters fixed share if NO sons
    if num_sons == 0 and num_daughters > 0:
        if num_daughters == 1:
            fixed_shares["Daughter"] = Fraction(1, 2)
        else:
            fixed_shares["Daughter"] = Fraction(2, 3)

    total_fixed = sum(fixed_shares.values(), Fraction(0, 1))

    # Check for Awl (Total fixed shares exceed 1)
    final_fractions: Dict[str, Fraction] = {}
    if total_fixed > 1:
        # Awl: reduce all fixed shares proportionally
        common_denominator = total_fixed.denominator
        sum_numerators = sum(f.numerator * (common_denominator // f.denominator) for f in fixed_shares.values())
        for rel, f in fixed_shares.items():
            final_fractions[rel] = Fraction(f.numerator * (common_denominator // f.denominator), sum_numerators)
        warnings.append(f"Awl (عول) applied: Total fixed shares ({total_fixed}) exceeded 1 and were proportionally normalized.")
    else:
        residual = Fraction(1, 1) - total_fixed
        final_fractions = dict(fixed_shares)

        # Distribute residual
        if num_sons > 0:
            # Sons & Daughters share residual: Son gets 2 parts, Daughter gets 1 part
            total_parts = (num_sons * 2) + num_daughters
            if total_parts > 0 and residual > 0:
                son_fraction = residual * Fraction(num_sons * 2, total_parts)
                final_fractions["Son"] = son_fraction

                if num_daughters > 0:
                    daughter_fraction = residual * Fraction(num_daughters, total_parts)
                    final_fractions["Daughter"] = daughter_fraction
        elif num_daughters > 0:
            # Daughters already have fixed share. If residual remains:
            if residual > 0:
                if num_fathers > 0:
                    # Father takes residual as Asaba
                    final_fractions["Father"] = final_fractions.get("Father", Fraction(0, 1)) + residual
                else:
                    # Radd (Return): Redistribute residual among non-spouse sharers proportionally
                    non_spouse_rel = [r for r in final_fractions if r not in ("Wife", "Husband") and final_fractions[r] > 0]
                    if non_spouse_rel:
                        non_spouse_sum = sum(final_fractions[r] for r in non_spouse_rel)
                        for r in non_spouse_rel:
                            final_fractions[r] += residual * (final_fractions[r] / non_spouse_sum)
                        warnings.append("Radd (رد) applied: Surplus estate redistributed among non-spouse Quranic sharers.")
                    else:
                        # If only spouse, spouse takes residual
                        spouse_rel = "Wife" if num_wives > 0 else "Husband"
                        if spouse_rel in final_fractions:
                            final_fractions[spouse_rel] += residual
        else:
            # No children
            if residual > 0:
                if num_fathers > 0:
                    final_fractions["Father"] = final_fractions.get("Father", Fraction(0, 1)) + residual
                elif num_mothers > 0:
                    final_fractions["Mother"] = final_fractions.get("Mother", Fraction(0, 1)) + residual
                elif num_wives > 0:
                    final_fractions["Wife"] += residual
                elif num_husbands > 0:
                    final_fractions["Husband"] += residual

    # Build output heir results
    results: List[Dict[str, Any]] = []
    total_distributed = 0.0

    # Ensure consistent ordering: Wife, Husband, Father, Mother, Son, Daughter
    ordering = ["Wife", "Husband", "Father", "Mother", "Son", "Daughter"]
    ordered_relations = [r for r in ordering if r in final_fractions and counts.get(r, 0) > 0]
    for r in final_fractions:
        if r not in ordered_relations and counts.get(r, 0) > 0:
            ordered_relations.append(r)

    for rel in ordered_relations:
        frac = final_fractions[rel]
        cnt = counts[rel]
        group_percentage = float(frac) * 100.0
        group_decimal = float(frac) * deceased_total_share
        total_distributed += group_decimal

        ind_decimal = group_decimal / cnt if cnt > 0 else 0.0
        ind_percentage = group_percentage / cnt if cnt > 0 else 0.0

        results.append({
            "relation": rel,
            "count": cnt,
            "share_fraction": f"{frac.numerator}/{frac.denominator}",
            "share_decimal": round(group_decimal, 6),
            "share_percentage": round(group_percentage, 4),
            "individual_share_decimal": round(ind_decimal, 6),
            "individual_share_percentage": round(ind_percentage, 4),
        })

    return {
        "deceased_share": deceased_total_share,
        "total_distributed_share": round(total_distributed, 6),
        "inheritance_system": "ISLAMIC",
        "heirs": results,
        "warnings": warnings,
    }
