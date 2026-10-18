from __future__ import annotations

import pytest
from app.services.faraid_engine import calculate_islamic_inheritance
from app.services.hindu_inheritance import calculate_hindu_inheritance


def test_faraid_sample_case_wife_two_sons_one_daughter():
    """
    Benchmark test from project_context.json:
    Md. Rahat Ali: 2.75 decimal share.
    Heirs: 1 Wife, 2 Sons, 1 Daughter.
    Rules:
    - Wife gets 1/8 (0.34375)
    - Sons + Daughter share residual 7/8 in 2:1 ratio (total 5 parts)
    - Daughter: (7/8)*(1/5) = 7/40 = 0.48125
    - Each Son: (7/8)*(2/5) = 14/40 = 7/20 = 0.9625 (both sons = 1.925)
    """
    heirs = [
        {"relation": "Wife", "count": 1},
        {"relation": "Son", "count": 2},
        {"relation": "Daughter", "count": 1},
    ]
    res = calculate_islamic_inheritance(deceased_total_share=2.75, heirs=heirs)

    assert res["inheritance_system"] == "ISLAMIC"
    assert round(res["total_distributed_share"], 4) == 2.75

    heir_map = {h["relation"]: h for h in res["heirs"]}

    # Wife
    assert heir_map["Wife"]["share_fraction"] == "1/8"
    assert round(heir_map["Wife"]["share_decimal"], 4) == 0.3438

    # Daughter
    assert heir_map["Daughter"]["share_fraction"] == "7/40"
    assert round(heir_map["Daughter"]["share_decimal"], 4) == 0.4813

    # Sons (2 sons total 28/40 = 7/10)
    assert heir_map["Son"]["share_fraction"] == "7/10"
    assert round(heir_map["Son"]["share_decimal"], 4) == 1.925
    assert round(heir_map["Son"]["individual_share_decimal"], 4) == 0.9625


def test_faraid_no_children_wife_parents():
    """Wife (1/4), Mother (1/3), Father (takes residual 5/12)."""
    heirs = [
        {"relation": "Wife", "count": 1},
        {"relation": "Mother", "count": 1},
        {"relation": "Father", "count": 1},
    ]
    res = calculate_islamic_inheritance(deceased_total_share=12.0, heirs=heirs)
    assert round(res["total_distributed_share"], 4) == 12.0

    heir_map = {h["relation"]: h for h in res["heirs"]}
    assert heir_map["Wife"]["share_fraction"] == "1/4"
    assert round(heir_map["Wife"]["share_decimal"], 2) == 3.0

    assert heir_map["Mother"]["share_fraction"] == "1/3"
    assert round(heir_map["Mother"]["share_decimal"], 2) == 4.0

    assert heir_map["Father"]["share_fraction"] == "5/12"
    assert round(heir_map["Father"]["share_decimal"], 2) == 5.0


def test_faraid_only_daughters_and_father():
    """One daughter gets 1/2 fixed share. Father gets 1/6 + residual."""
    heirs = [
        {"relation": "Daughter", "count": 1},
        {"relation": "Father", "count": 1},
    ]
    res = calculate_islamic_inheritance(deceased_total_share=10.0, heirs=heirs)
    assert round(res["total_distributed_share"], 4) == 10.0

    heir_map = {h["relation"]: h for h in res["heirs"]}
    assert heir_map["Daughter"]["share_fraction"] == "1/2"
    assert round(heir_map["Daughter"]["share_decimal"], 2) == 5.0

    assert heir_map["Father"]["share_fraction"] == "1/2"
    assert round(heir_map["Father"]["share_decimal"], 2) == 5.0


def test_faraid_multiple_daughters_fixed_share():
    """Two daughters get 2/3 share divided equally."""
    heirs = [
        {"relation": "Daughter", "count": 2},
        {"relation": "Mother", "count": 1},
        {"relation": "Father", "count": 1},
    ]
    res = calculate_islamic_inheritance(deceased_total_share=6.0, heirs=heirs)
    assert round(res["total_distributed_share"], 4) == 6.0

    heir_map = {h["relation"]: h for h in res["heirs"]}
    assert heir_map["Daughter"]["share_fraction"] == "2/3"
    assert round(heir_map["Daughter"]["share_decimal"], 2) == 4.0
    assert round(heir_map["Daughter"]["individual_share_decimal"], 2) == 2.0


def test_hindu_inheritance_dayabhaga():
    """Hindu Dayabhaga: Spouse and all children inherit equally."""
    heirs = [
        {"relation": "Wife", "count": 1},
        {"relation": "Son", "count": 1},
        {"relation": "Daughter", "count": 1},
    ]
    res = calculate_hindu_inheritance(deceased_total_share=15.0, heirs=heirs)
    assert res["inheritance_system"] == "HINDU"
    assert round(res["total_distributed_share"], 4) == 15.0

    for h in res["heirs"]:
        assert h["share_fraction"] == "1/3"
        assert round(h["share_decimal"], 2) == 5.0
