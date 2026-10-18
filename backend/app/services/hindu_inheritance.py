from __future__ import annotations

from fractions import Fraction
from typing import List, Dict, Any


def calculate_hindu_inheritance(deceased_total_share: float, heirs: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Calculate Hindu Dayabhaga inheritance shares according to Bengal Dayabhaga school of law
    and the Hindu Women's Rights to Property Act.

    Rules:
    - All children (sons AND daughters) inherit equally
    - Surviving spouse gets an equal share as each child
    - If no children, spouse inherits everything
    """
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

    num_spouses = counts.get("Wife", 0) + counts.get("Husband", 0)
    num_sons = counts.get("Son", 0)
    num_daughters = counts.get("Daughter", 0)
    num_children = num_sons + num_daughters
    num_mothers = counts.get("Mother", 0)
    num_fathers = counts.get("Father", 0)

    warnings: List[str] = []
    final_fractions: Dict[str, Fraction] = {}

    if num_children > 0:
        # Dayabhaga with children: spouse gets equal share as each child
        total_units = num_spouses + num_children
        unit_fraction = Fraction(1, total_units)

        if counts.get("Wife", 0) > 0:
            final_fractions["Wife"] = unit_fraction * counts["Wife"]
        if counts.get("Husband", 0) > 0:
            final_fractions["Husband"] = unit_fraction * counts["Husband"]
        if num_sons > 0:
            final_fractions["Son"] = unit_fraction * num_sons
        if num_daughters > 0:
            final_fractions["Daughter"] = unit_fraction * num_daughters
    elif num_spouses > 0:
        # No children: spouse inherits entire estate
        if counts.get("Wife", 0) > 0:
            final_fractions["Wife"] = Fraction(1, 1)
        elif counts.get("Husband", 0) > 0:
            final_fractions["Husband"] = Fraction(1, 1)
    elif num_fathers > 0 or num_mothers > 0:
        # No spouse or children: parents inherit
        parent_units = num_fathers + num_mothers
        if num_fathers > 0:
            final_fractions["Father"] = Fraction(num_fathers, parent_units)
        if num_mothers > 0:
            final_fractions["Mother"] = Fraction(num_mothers, parent_units)
    else:
        warnings.append("No primary heirs (spouse, children, or parents) found.")

    results: List[Dict[str, Any]] = []
    total_distributed = 0.0

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
        "inheritance_system": "HINDU",
        "heirs": results,
        "warnings": warnings,
    }
