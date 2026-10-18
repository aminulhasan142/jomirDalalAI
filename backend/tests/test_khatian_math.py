from __future__ import annotations

import pytest
from app.services.khatian_math import (
    TOTAL_TIL_FULL_SHARE,
    ana_gonda_to_decimal,
    decimal_to_ana_gonda,
    calculate_land_area,
    validate_shares,
    parse_bangla_share_text,
)


def test_ana_gonda_to_decimal_full_share():
    """16 Ana should equal 1.0 (100%) and 57600 Til."""
    res = ana_gonda_to_decimal(ana=16, gonda=0, kara=0, kranti=0)
    assert res["total_til"] == TOTAL_TIL_FULL_SHARE
    assert res["decimal_share"] == 1.0
    assert res["percentage"] == 100.0
    assert res["ana_equivalent"] == 16.0


def test_ana_gonda_to_decimal_half_share():
    """8 Ana should equal 0.5 (50%) and 28800 Til."""
    res = ana_gonda_to_decimal(ana=8, gonda=0, kara=0, kranti=0)
    assert res["total_til"] == 28800
    assert res["decimal_share"] == 0.5
    assert res["percentage"] == 50.0
    assert res["ana_equivalent"] == 8.0


def test_ana_gonda_to_decimal_quarter_share():
    """4 Ana should equal 0.25 (25%)."""
    res = ana_gonda_to_decimal(ana=4, gonda=0, kara=0, kranti=0)
    assert res["decimal_share"] == 0.25
    assert res["percentage"] == 25.0


def test_ana_gonda_subdivisions():
    """Test mixed subdivisions conversion."""
    res = ana_gonda_to_decimal(ana=4, gonda=8, kara=0, kranti=0)
    # (4 * 3600) + (8 * 240) = 14400 + 1920 = 16320
    assert res["total_til"] == 16320
    assert round(res["decimal_share"], 4) == round(16320 / 57600, 4)


def test_decimal_to_ana_gonda():
    """Converting 1.0, 0.5, 0.25 back to Ana-Gonda."""
    res_full = decimal_to_ana_gonda(1.0)
    assert res_full["ana"] == 16
    assert res_full["gonda"] == 0
    assert res_full["kara"] == 0
    assert res_full["kranti"] == 0

    res_half = decimal_to_ana_gonda(0.5)
    assert res_half["ana"] == 8
    assert res_half["gonda"] == 0

    res_quarter = decimal_to_ana_gonda(0.25)
    assert res_quarter["ana"] == 4
    assert res_quarter["gonda"] == 0


def test_ana_gonda_roundtrip():
    """Roundtrip conversion from Ana-Gonda to decimal and back."""
    test_cases = [
        (16, 0, 0, 0),
        (8, 0, 0, 0),
        (4, 5, 2, 1),
        (2, 10, 1, 2),
    ]
    for ana, gonda, kara, kranti in test_cases:
        dec = ana_gonda_to_decimal(ana, gonda, kara, kranti)["decimal_share"]
        back = decimal_to_ana_gonda(dec)
        assert back["ana"] == ana
        assert back["gonda"] == gonda
        assert back["kara"] == kara
        assert back["kranti"] == kranti


def test_calculate_land_area():
    """Verify calculation of area in decimals and square feet (1 decimal = 435.6 sqft)."""
    res = calculate_land_area(total_area_decimal=10.0, ownership_decimal=0.5)
    assert res["owned_area_decimal"] == 5.0
    assert res["owned_area_sqft"] == 5.0 * 435.6

    res2 = calculate_land_area(total_area_decimal=25.0, ownership_decimal=0.25)
    assert res2["owned_area_decimal"] == 6.25
    assert res2["owned_area_sqft"] == round(6.25 * 435.6, 2)


def test_validate_shares_balanced():
    """Validate 4 co-sharers with 4 Ana each sum to 100%."""
    shares = [
        {"ana": 4, "gonda": 0, "kara": 0, "kranti": 0},
        {"ana": 4, "gonda": 0, "kara": 0, "kranti": 0},
        {"ana": 4, "gonda": 0, "kara": 0, "kranti": 0},
        {"ana": 4, "gonda": 0, "kara": 0, "kranti": 0},
    ]
    val = validate_shares(shares)
    assert val["is_valid"] is True
    assert val["total_til"] == 57600
    assert val["total_percentage"] == 100.0
    assert val["discrepancy_percentage"] == 0.0


def test_validate_shares_imbalanced():
    """Validate detection of deficit and surplus shares."""
    # Deficit: only 12 Ana
    deficit_shares = [{"ana": 12, "gonda": 0, "kara": 0, "kranti": 0}]
    val_def = validate_shares(deficit_shares)
    assert val_def["is_valid"] is False
    assert val_def["total_percentage"] == 75.0
    assert val_def["discrepancy_percentage"] == 25.0

    # Surplus: 18 Ana
    surplus_shares = [{"ana": 18, "gonda": 0, "kara": 0, "kranti": 0}]
    val_sur = validate_shares(surplus_shares)
    assert val_sur["is_valid"] is False
    assert val_sur["total_percentage"] > 100.0


def test_parse_bangla_share_text():
    """Test parsing of various Bengali numeral share texts."""
    res1 = parse_bangla_share_text("৪ আনা ৮ গণ্ডা")
    assert res1["ana"] == 4
    assert res1["gonda"] == 8
    assert res1["kara"] == 0
    assert res1["kranti"] == 0

    res2 = parse_bangla_share_text("১৬ আনা ০ গণ্ডা")
    assert res2["ana"] == 16
    assert res2["gonda"] == 0

    res3 = parse_bangla_share_text("২ আনা ৪ গন্ডা ১ কড়া ১ ক্রান্তি")
    assert res3["ana"] == 2
    assert res3["gonda"] == 4
    assert res3["kara"] == 1
    assert res3["kranti"] == 1

    res4 = parse_bangla_share_text("৩ আনা ২ কড়া ১ ক্রান্তি")
    assert res4["ana"] == 3
    assert res4["kara"] == 2
    assert res4["kranti"] == 1

    res_empty = parse_bangla_share_text("")
    assert res_empty == {"ana": 0, "gonda": 0, "kara": 0, "kranti": 0}
