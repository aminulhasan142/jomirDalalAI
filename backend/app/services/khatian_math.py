from __future__ import annotations

import re
from typing import List, Dict, Any

# 16 Ana = 1 Full Share (100% or 1.0)
# Subdivisions: 1 Ana = 20 Gonda | 1 Gonda = 4 Kara | 1 Kara = 3 Kranti | 1 Kranti = 20 Til
TOTAL_TIL_FULL_SHARE: int = 57600  # 16 * 20 * 4 * 3 * 20


def ana_gonda_to_decimal(ana: int = 0, gonda: int = 0, kara: int = 0, kranti: int = 0) -> Dict[str, Any]:
    """Convert Ana-Gonda-Kara-Kranti to decimal share and percentage."""
    total_til = (ana * 3600) + (gonda * 240) + (kara * 60) + (kranti * 20)
    decimal_share = total_til / TOTAL_TIL_FULL_SHARE
    percentage = decimal_share * 100
    ana_equivalent = decimal_share * 16
    return {
        "input": {"ana": ana, "gonda": gonda, "kara": kara, "kranti": kranti},
        "total_til": total_til,
        "decimal_share": round(decimal_share, 6),
        "percentage": round(percentage, 4),
        "ana_equivalent": round(ana_equivalent, 4),
    }


def decimal_to_ana_gonda(decimal_share: float) -> Dict[str, Any]:
    """Convert decimal share back to Ana-Gonda-Kara-Kranti."""
    total_til = round(decimal_share * TOTAL_TIL_FULL_SHARE)
    ana = total_til // 3600
    remainder = total_til % 3600
    gonda = remainder // 240
    remainder = remainder % 240
    kara = remainder // 60
    remainder = remainder % 60
    kranti = remainder // 20
    return {
        "ana": int(ana),
        "gonda": int(gonda),
        "kara": int(kara),
        "kranti": int(kranti),
        "decimal_share": round(decimal_share, 6),
    }


def calculate_land_area(total_area_decimal: float, ownership_decimal: float) -> Dict[str, Any]:
    """Calculate actual land area from ownership share."""
    owned_area = total_area_decimal * ownership_decimal
    return {
        "total_area_decimal": round(total_area_decimal, 4),
        "ownership_share": round(ownership_decimal, 6),
        "owned_area_decimal": round(owned_area, 4),
        "owned_area_sqft": round(owned_area * 435.6, 2),  # 1 decimal = 435.6 sqft
    }


def validate_shares(shares: List[Dict[str, int]]) -> Dict[str, Any]:
    """Validate that all owner shares sum to 16 Ana (100%)."""
    total_til = 0
    for share in shares:
        total_til += (
            share.get("ana", 0) * 3600
            + share.get("gonda", 0) * 240
            + share.get("kara", 0) * 60
            + share.get("kranti", 0) * 20
        )
    total_percentage = (total_til / TOTAL_TIL_FULL_SHARE) * 100
    is_valid = abs(total_percentage - 100.0) < 0.01
    return {
        "total_til": total_til,
        "expected_til": TOTAL_TIL_FULL_SHARE,
        "total_percentage": round(total_percentage, 4),
        "is_valid": is_valid,
        "discrepancy_percentage": round(abs(100.0 - total_percentage), 4),
    }


def parse_bangla_share_text(text: str) -> Dict[str, int]:
    """Parse Bangla share text like '৪ আনা ৮ গণ্ডা' into numeric values."""
    if not text:
        return {"ana": 0, "gonda": 0, "kara": 0, "kranti": 0}

    bangla_digits = {
        "০": "0", "১": "1", "২": "2", "৩": "3", "৪": "4",
        "৫": "5", "৬": "6", "৭": "7", "৮": "8", "৯": "9",
    }
    converted = text
    for bd, ed in bangla_digits.items():
        converted = converted.replace(bd, ed)

    result = {"ana": 0, "gonda": 0, "kara": 0, "kranti": 0}
    ana_match = re.search(r"(\d+)\s*(?:আনা|ana)", converted, re.IGNORECASE)
    gonda_match = re.search(r"(\d+)\s*(?:গণ্ডা|গন্ডা|gonda)", converted, re.IGNORECASE)
    kara_match = re.search(r"(\d+)\s*(?:কড়া|কড়া|kara)", converted, re.IGNORECASE)
    kranti_match = re.search(r"(\d+)\s*(?:ক্রান্তি|kranti)", converted, re.IGNORECASE)

    if ana_match:
        result["ana"] = int(ana_match.group(1))
    if gonda_match:
        result["gonda"] = int(gonda_match.group(1))
    if kara_match:
        result["kara"] = int(kara_match.group(1))
    if kranti_match:
        result["kranti"] = int(kranti_match.group(1))

    return result
