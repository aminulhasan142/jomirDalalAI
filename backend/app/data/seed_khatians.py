from __future__ import annotations

import logging
from sqlalchemy.orm import Session
from app.models.khatian import Khatian
from app.models.owner import Owner
from app.models.heir import FamilyTree, Heir
from app.models.audit_report import AuditReport
from app.services.khatian_math import ana_gonda_to_decimal, calculate_land_area

logger = logging.getLogger("jomir_dalal.seed")


def seed_database(db: Session) -> int:
    """
    Populate database with 5 synthetic benchmark Khatian records,
    co-sharers, and realistic family trees compliant with competition rulebook
    (zero live scraping, zero real personal data).
    """
    # Check if records already exist
    existing_count = db.query(Khatian).count()
    if existing_count > 0:
        logger.info(f"Database already has {existing_count} khatians. Clearing for fresh seed.")
        db.query(AuditReport).delete()
        db.query(Heir).delete()
        db.query(FamilyTree).delete()
        db.query(Owner).delete()
        db.query(Khatian).delete()
        db.commit()

    seed_data = [
        # Record 1: Dhanmondi Khatian 102 (From project_context.json)
        {
            "khatian_no": "102",
            "khatian_type": "RS",
            "mouza": "Dhanmondi",
            "jl_no": "54",
            "dag_no": "405",
            "total_area_decimal": 10.0,
            "owners": [
                {
                    "name": "Md. Rahat Ali",
                    "father_name": "Late Abdul Latif",
                    "share_text": "৪ আনা ৮ গণ্ডা",
                    "share_ana": 4,
                    "share_gonda": 8,
                    "share_kara": 0,
                    "share_kranti": 0,
                    "calculated_decimal": 2.75,
                    "ownership_percentage": 27.5,
                    "family_tree": {
                        "deceased_name": "Md. Rahat Ali",
                        "inheritance_system": "ISLAMIC",
                        "heirs": [
                            {"relation": "Wife", "count": 1, "fraction": "1/8", "decimal": 0.34375},
                            {"relation": "Son", "count": 2, "fraction": "7/20", "decimal": 1.925},
                            {"relation": "Daughter", "count": 1, "fraction": "7/40", "decimal": 0.48125},
                        ],
                    },
                },
                {
                    "name": "Md. Faruq Ahmed",
                    "father_name": "Late Abdul Latif",
                    "share_text": "১১ আনা ১২ গণ্ডা",
                    "share_ana": 11,
                    "share_gonda": 12,
                    "share_kara": 0,
                    "share_kranti": 0,
                    "calculated_decimal": 7.25,
                    "ownership_percentage": 72.5,
                    "family_tree": None,
                },
            ],
        },
        # Record 2: Mirpur Khatian 245
        {
            "khatian_no": "245",
            "khatian_type": "RS",
            "mouza": "Mirpur",
            "jl_no": "12",
            "dag_no": "782",
            "total_area_decimal": 15.5,
            "owners": [
                {
                    "name": "Late Abdul Mannan",
                    "father_name": "Kader Box",
                    "share_text": "৮ আনা ০ গণ্ডা",
                    "share_ana": 8,
                    "share_gonda": 0,
                    "share_kara": 0,
                    "share_kranti": 0,
                    "calculated_decimal": 7.75,
                    "ownership_percentage": 50.0,
                    "family_tree": {
                        "deceased_name": "Late Abdul Mannan",
                        "inheritance_system": "ISLAMIC",
                        "heirs": [
                            {"relation": "Wife", "count": 1, "fraction": "1/8", "decimal": 0.96875},
                            {"relation": "Son", "count": 1, "fraction": "7/16", "decimal": 3.390625},
                            {"relation": "Daughter", "count": 2, "fraction": "7/16", "decimal": 3.390625},
                        ],
                    },
                },
                {
                    "name": "Begum Rokeya",
                    "father_name": "Kader Box",
                    "share_text": "৪ আনা ০ গণ্ডা",
                    "share_ana": 4,
                    "share_gonda": 0,
                    "share_kara": 0,
                    "share_kranti": 0,
                    "calculated_decimal": 3.875,
                    "ownership_percentage": 25.0,
                    "family_tree": None,
                },
                {
                    "name": "Tariqul Islam",
                    "father_name": "Kader Box",
                    "share_text": "৪ আনা ০ গণ্ডা",
                    "share_ana": 4,
                    "share_gonda": 0,
                    "share_kara": 0,
                    "share_kranti": 0,
                    "calculated_decimal": 3.875,
                    "ownership_percentage": 25.0,
                    "family_tree": None,
                },
            ],
        },
        # Record 3: Gulshan Khatian 88 (City Survey / BS)
        {
            "khatian_no": "88",
            "khatian_type": "BS",
            "mouza": "Gulshan",
            "jl_no": "04",
            "dag_no": "1120",
            "total_area_decimal": 25.0,
            "owners": [
                {
                    "name": "Anisur Rahman",
                    "father_name": "Moinuddin Ahmed",
                    "share_text": "৪ আনা ০ গণ্ডা",
                    "share_ana": 4,
                    "share_gonda": 0,
                    "share_kara": 0,
                    "share_kranti": 0,
                    "calculated_decimal": 6.25,
                    "ownership_percentage": 25.0,
                    "family_tree": None,
                },
                {
                    "name": "Mahbubur Rahman",
                    "father_name": "Moinuddin Ahmed",
                    "share_text": "৪ আনা ০ গণ্ডা",
                    "share_ana": 4,
                    "share_gonda": 0,
                    "share_kara": 0,
                    "share_kranti": 0,
                    "calculated_decimal": 6.25,
                    "ownership_percentage": 25.0,
                    "family_tree": None,
                },
                {
                    "name": "Nasreen Akter",
                    "father_name": "Moinuddin Ahmed",
                    "share_text": "৪ আনা ০ গণ্ডা",
                    "share_ana": 4,
                    "share_gonda": 0,
                    "share_kara": 0,
                    "share_kranti": 0,
                    "calculated_decimal": 6.25,
                    "ownership_percentage": 25.0,
                    "family_tree": None,
                },
                {
                    "name": "Salma Begum",
                    "father_name": "Moinuddin Ahmed",
                    "share_text": "৪ আনা ০ গণ্ডা",
                    "share_ana": 4,
                    "share_gonda": 0,
                    "share_kara": 0,
                    "share_kranti": 0,
                    "calculated_decimal": 6.25,
                    "ownership_percentage": 25.0,
                    "family_tree": None,
                },
            ],
        },
        # Record 4: Uttara Khatian 312 (State Acquisition / SA)
        {
            "khatian_no": "312",
            "khatian_type": "SA",
            "mouza": "Uttara",
            "jl_no": "18",
            "dag_no": "503",
            "total_area_decimal": 12.0,
            "owners": [
                {
                    "name": "Kazi Shamsul Huda",
                    "father_name": "Kazi Nurul Huda",
                    "share_text": "১৬ আনা ০ গণ্ডা",
                    "share_ana": 16,
                    "share_gonda": 0,
                    "share_kara": 0,
                    "share_kranti": 0,
                    "calculated_decimal": 12.0,
                    "ownership_percentage": 100.0,
                    "family_tree": None,
                },
            ],
        },
        # Record 5: Savar Khatian 504 (Cadastral Survey / CS - Hindu Dayabhaga)
        {
            "khatian_no": "504",
            "khatian_type": "CS",
            "mouza": "Savar",
            "jl_no": "89",
            "dag_no": "234",
            "total_area_decimal": 30.0,
            "owners": [
                {
                    "name": "Late Bimal Chandra Das",
                    "father_name": "Gopal Chandra Das",
                    "share_text": "৮ আনা ০ গণ্ডা",
                    "share_ana": 8,
                    "share_gonda": 0,
                    "share_kara": 0,
                    "share_kranti": 0,
                    "calculated_decimal": 15.0,
                    "ownership_percentage": 50.0,
                    "family_tree": {
                        "deceased_name": "Late Bimal Chandra Das",
                        "inheritance_system": "HINDU",
                        "heirs": [
                            {"relation": "Wife", "count": 1, "fraction": "1/3", "decimal": 5.0},
                            {"relation": "Son", "count": 1, "fraction": "1/3", "decimal": 5.0},
                            {"relation": "Daughter", "count": 1, "fraction": "1/3", "decimal": 5.0},
                        ],
                    },
                },
                {
                    "name": "Nirmal Chandra Das",
                    "father_name": "Gopal Chandra Das",
                    "share_text": "৮ আনা ০ গণ্ডা",
                    "share_ana": 8,
                    "share_gonda": 0,
                    "share_kara": 0,
                    "share_kranti": 0,
                    "calculated_decimal": 15.0,
                    "ownership_percentage": 50.0,
                    "family_tree": None,
                },
            ],
        },
    ]

    count = 0
    for k_data in seed_data:
        khatian = Khatian(
            khatian_no=k_data["khatian_no"],
            khatian_type=k_data["khatian_type"],
            mouza=k_data["mouza"],
            jl_no=k_data["jl_no"],
            dag_no=k_data["dag_no"],
            total_area_decimal=k_data["total_area_decimal"],
            raw_ocr_output={"source": "Synthetic Benchmark Seed Record"},
        )
        db.add(khatian)
        db.flush()

        for o_data in k_data["owners"]:
            owner = Owner(
                khatian_id=khatian.id,
                name=o_data["name"],
                father_name=o_data["father_name"],
                share_text=o_data["share_text"],
                share_ana=o_data["share_ana"],
                share_gonda=o_data["share_gonda"],
                share_kara=o_data["share_kara"],
                share_kranti=o_data["share_kranti"],
                calculated_decimal=o_data["calculated_decimal"],
                ownership_percentage=o_data["ownership_percentage"],
            )
            db.add(owner)
            db.flush()

            ft_data = o_data.get("family_tree")
            if ft_data:
                ft = FamilyTree(
                    owner_id=owner.id,
                    deceased_name=ft_data["deceased_name"],
                    inheritance_system=ft_data["inheritance_system"],
                )
                db.add(ft)
                db.flush()

                for h_data in ft_data["heirs"]:
                    heir = Heir(
                        family_tree_id=ft.id,
                        relation=h_data["relation"],
                        count=h_data["count"],
                        legal_share_fraction=h_data["fraction"],
                        legal_share_decimal=h_data["decimal"],
                    )
                    db.add(heir)

        count += 1

    db.commit()
    logger.info(f"Successfully seeded {count} Khatian records.")
    return count
