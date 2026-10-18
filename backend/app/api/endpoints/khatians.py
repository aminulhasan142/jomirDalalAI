from __future__ import annotations

from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload

from app.database import get_db
from app.models.khatian import Khatian
from app.models.owner import Owner
from app.schemas.khatian import KhatianCreate, KhatianResponse
from app.services.khatian_math import ana_gonda_to_decimal, calculate_land_area, parse_bangla_share_text

router = APIRouter(prefix="/khatians", tags=["Khatians Management"])


@router.get("", response_model=List[KhatianResponse], status_code=status.HTTP_200_OK)
def list_khatians(skip: int = 0, limit: int = 50, db: Session = Depends(get_db)) -> List[Khatian]:
    """Retrieve list of all Khatian land records with owners."""
    khatians = (
        db.query(Khatian)
        .options(joinedload(Khatian.owners))
        .order_by(Khatian.id.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )
    return khatians


@router.get("/{khatian_id}", response_model=KhatianResponse, status_code=status.HTTP_200_OK)
def get_khatian(khatian_id: int, db: Session = Depends(get_db)) -> Khatian:
    """Retrieve a specific Khatian by ID with all co-sharers."""
    khatian = (
        db.query(Khatian)
        .options(joinedload(Khatian.owners))
        .filter(Khatian.id == khatian_id)
        .first()
    )
    if not khatian:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Khatian with ID {khatian_id} not found.",
        )
    return khatian


@router.post("", response_model=KhatianResponse, status_code=status.HTTP_201_CREATED)
def create_khatian(khatian_in: KhatianCreate, db: Session = Depends(get_db)) -> Khatian:
    """Create a new Khatian record along with its co-sharers."""
    khatian = Khatian(
        khatian_no=khatian_in.khatian_no,
        khatian_type=khatian_in.khatian_type,
        mouza=khatian_in.mouza,
        jl_no=khatian_in.jl_no,
        dag_no=khatian_in.dag_no,
        total_area_decimal=khatian_in.total_area_decimal,
        raw_ocr_output=khatian_in.raw_ocr_output,
    )
    db.add(khatian)
    db.flush()  # Populates khatian.id

    for owner_in in khatian_in.owners:
        ana = owner_in.share_ana
        gonda = owner_in.share_gonda
        kara = owner_in.share_kara
        kranti = owner_in.share_kranti

        if owner_in.share_breakdown:
            ana = owner_in.share_breakdown.ana
            gonda = owner_in.share_breakdown.gonda
            kara = owner_in.share_breakdown.kara
            kranti = owner_in.share_breakdown.kranti
        elif ana == 0 and gonda == 0 and owner_in.share_text:
            parsed = parse_bangla_share_text(owner_in.share_text)
            ana, gonda, kara, kranti = parsed["ana"], parsed["gonda"], parsed["kara"], parsed["kranti"]

        conv = ana_gonda_to_decimal(ana, gonda, kara, kranti)
        calc_area = calculate_land_area(khatian_in.total_area_decimal, conv["decimal_share"])

        calc_dec = owner_in.calculated_decimal or calc_area["owned_area_decimal"]
        own_pct = owner_in.ownership_percentage or conv["percentage"]

        owner = Owner(
            khatian_id=khatian.id,
            name=owner_in.name,
            father_name=owner_in.father_name,
            share_text=owner_in.share_text or f"{ana} আনা {gonda} গণ্ডা",
            share_ana=ana,
            share_gonda=gonda,
            share_kara=kara,
            share_kranti=kranti,
            calculated_decimal=calc_dec,
            ownership_percentage=own_pct,
        )
        db.add(owner)

    db.commit()
    db.refresh(khatian)
    return khatian


@router.post("/seed", status_code=status.HTTP_200_OK)
def trigger_seed(db: Session = Depends(get_db)):
    """Seed the database with 5 synthetic benchmark Khatian records and family trees."""
    from app.data.seed_khatians import seed_database
    count = seed_database(db)
    return {"message": f"Successfully seeded {count} Khatian records with co-sharers and family trees."}
