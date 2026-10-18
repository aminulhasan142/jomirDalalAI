from __future__ import annotations

import pytest
from fastapi.testclient import TestClient
from app.services.scorecard_generator import (
    generate_scorecard,
    perform_share_sum_check,
    perform_seller_share_check,
    calculate_risk_level,
)


def test_scorecard_green_clear_title():
    """Scorecard generation for a balanced Khatian with clear title."""
    khatian_data = {
        "khatian_no": "88",
        "khatian_type": "BS",
        "mouza": "Gulshan",
        "dag_no": "1120",
        "total_area_decimal": 25.0,
        "owners": [
            {"name": "Anisur Rahman", "share_ana": 4, "ownership_percentage": 25.0},
            {"name": "Mahbubur Rahman", "share_ana": 4, "ownership_percentage": 25.0},
            {"name": "Nasreen Akter", "share_ana": 4, "ownership_percentage": 25.0},
            {"name": "Salma Begum", "share_ana": 4, "ownership_percentage": 25.0},
        ],
    }

    scorecard = generate_scorecard(khatian_data=khatian_data)
    assert scorecard.risk_level == "GREEN"
    assert scorecard.risk_score <= 20.0
    assert any(c.check_name == "SHARE_SUM_CHECK" and c.status == "PASS" for c in scorecard.checks)


def test_scorecard_yellow_discrepancy():
    """Scorecard generation for a Khatian with incomplete mutation (deficit shares)."""
    khatian_data = {
        "khatian_no": "99",
        "khatian_type": "RS",
        "mouza": "Tejgaon",
        "dag_no": "100",
        "total_area_decimal": 10.0,
        "owners": [
            {"name": "Owner A", "share_ana": 8, "ownership_percentage": 50.0},
        ],
    }

    scorecard = generate_scorecard(khatian_data=khatian_data)
    assert scorecard.risk_level == "YELLOW"
    assert any(c.check_name == "SHARE_SUM_CHECK" and c.status == "WARN" for c in scorecard.checks)


def test_scorecard_red_seller_over_allocation():
    """Scorecard generation when seller claims more than legally entitled share."""
    khatian_data = {
        "khatian_no": "102",
        "khatian_type": "RS",
        "mouza": "Dhanmondi",
        "dag_no": "405",
        "total_area_decimal": 10.0,
        "owners": [
            {"name": "Md. Rahat Ali", "share_ana": 4, "share_gonda": 8, "ownership_percentage": 27.5},
            {"name": "Md. Faruq Ahmed", "share_ana": 11, "share_gonda": 12, "ownership_percentage": 72.5},
        ],
    }
    family_tree_data = {
        "deceased_owner": "Md. Rahat Ali",
        "deceased_share": 2.75,
        "heirs": [
            {"relation": "Wife", "count": 1},
            {"relation": "Son", "count": 2},
            {"relation": "Daughter", "count": 1},
        ],
    }

    # Seller attempts to sell 2.5 decimal, but entitled to only ~0.9625 decimal!
    scorecard = generate_scorecard(
        khatian_data=khatian_data,
        family_tree_data=family_tree_data,
        seller_claimed_share=2.5,
        seller_name="Son",
    )

    assert scorecard.risk_level == "RED"
    assert scorecard.risk_score >= 65.0
    assert any(c.check_name == "SELLER_ENTITLEMENT_CHECK" and c.status == "FAIL" for c in scorecard.checks)


def test_api_health_and_endpoints(client: TestClient):
    """Test FastAPI endpoints via TestClient."""
    # Health check
    res_health = client.get("/health")
    assert res_health.status_code == 200
    assert res_health.json()["status"] == "healthy"

    # Ana-Gonda Converter API
    res_conv = client.post("/api/v1/converter/ana-gonda", json={"ana": 16, "gonda": 0, "kara": 0, "kranti": 0})
    assert res_conv.status_code == 200
    assert res_conv.json()["decimal_share"] == 1.0

    # Parse Bangla API
    res_parse = client.post("/api/v1/converter/parse-bangla", json={"text": "৪ আনা ৮ গণ্ডা"})
    assert res_parse.status_code == 200
    assert res_parse.json()["breakdown"]["ana"] == 4
    assert res_parse.json()["breakdown"]["gonda"] == 8

    # Inheritance Calculate API
    res_inh = client.post(
        "/api/v1/inheritance/calculate",
        json={
            "deceased_share": 10.0,
            "heirs": [{"relation": "Wife", "count": 1}, {"relation": "Son", "count": 1}],
            "inheritance_system": "ISLAMIC",
        },
    )
    assert res_inh.status_code == 200
    assert len(res_inh.json()["heirs"]) == 2

    # Inheritance Audit API
    res_audit = client.post(
        "/api/v1/inheritance/audit",
        json={
            "seller_claimed_share": 5.0,
            "deceased_total_share": 10.0,
            "seller_relation": "Wife",
            "heirs": [{"relation": "Wife", "count": 1}, {"relation": "Son", "count": 1}],
            "inheritance_system": "ISLAMIC",
        },
    )
    assert res_audit.status_code == 200
    # Wife gets 1/8 = 1.25 decimal, but claims 5.0 -> FAIL / RED
    assert res_audit.json()["is_valid"] is False
    assert res_audit.json()["risk_level"] == "RED"


def test_khatian_crud_and_seeding(client: TestClient):
    """Test Khatian creation, retrieval, and seeding."""
    # Seed database
    res_seed = client.post("/api/v1/khatians/seed")
    assert res_seed.status_code == 200
    assert "Seeded" in res_seed.json()["message"] or "seeded" in res_seed.json()["message"]

    # List khatians
    res_list = client.get("/api/v1/khatians")
    assert res_list.status_code == 200
    khatians = res_list.json()
    assert len(khatians) >= 5

    # Get single khatian by ID
    khatian_id = khatians[0]["id"]
    res_single = client.get(f"/api/v1/khatians/{khatian_id}")
    assert res_single.status_code == 200
    assert res_single.json()["id"] == khatian_id
    assert len(res_single.json()["owners"]) > 0

    # Create new khatian
    new_khatian = {
        "khatian_no": "777",
        "khatian_type": "BS",
        "mouza": "Banani",
        "dag_no": "999",
        "total_area_decimal": 20.0,
        "owners": [
            {
                "name": "Kamal Hossain",
                "share_text": "১৬ আনা ০ গণ্ডা",
                "share_ana": 16,
                "share_gonda": 0,
                "calculated_decimal": 20.0,
                "ownership_percentage": 100.0,
            }
        ],
    }
    res_create = client.post("/api/v1/khatians", json=new_khatian)
    assert res_create.status_code == 201
    assert res_create.json()["khatian_no"] == "777"


def test_scorecard_persistence_and_get(client: TestClient):
    """Test generating a scorecard with save=true and retrieving it."""
    req_body = {
        "khatian_data": {
            "khatian_no": "102",
            "mouza": "Dhanmondi",
            "dag_no": "405",
            "total_area_decimal": 10.0,
            "owners": [
                {"name": "Md. Rahat Ali", "share_ana": 4, "share_gonda": 8, "ownership_percentage": 27.5},
                {"name": "Md. Faruq Ahmed", "share_ana": 11, "share_gonda": 12, "ownership_percentage": 72.5},
            ],
        },
        "seller_claimed_share": 2.75,
    }
    # Generate and save
    res_gen = client.post("/api/v1/scorecard/generate?save=true", json=req_body)
    assert res_gen.status_code == 200
    report_id = res_gen.json()["id"]
    assert report_id is not None

    # Retrieve saved scorecard
    res_get = client.get(f"/api/v1/scorecard/{report_id}")
    assert res_get.status_code == 200
    assert res_get.json()["id"] == report_id


def test_ocr_extract_endpoint(client: TestClient):
    """Test OCR endpoint with mock image payload."""
    import io
    from PIL import Image

    # Create a small blank image in-memory
    img_byte_arr = io.BytesIO()
    image = Image.new("RGB", (100, 100), color="white")
    image.save(img_byte_arr, format="JPEG")
    img_byte_arr.seek(0)

    response = client.post(
        "/api/v1/ocr/extract",
        files={"file": ("test_khatian.jpg", img_byte_arr, "image/jpeg")},
    )
    assert response.status_code == 200
    data = response.json()
    assert "khatian_no" in data
    assert "owners" in data
    assert len(data["owners"]) > 0

