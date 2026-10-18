from __future__ import annotations

from typing import Any
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.audit_report import AuditReport
from app.models.khatian import Khatian
from app.schemas.scorecard import ScorecardRequest, ScorecardResponse, AuditCheck
from app.services.scorecard_generator import generate_scorecard

router = APIRouter(prefix="/scorecard", tags=["Land Truth Scorecard"])


@router.post("/generate", response_model=ScorecardResponse, status_code=status.HTTP_200_OK)
def create_scorecard(
    req: ScorecardRequest,
    save: bool = False,
    db: Session = Depends(get_db),
) -> ScorecardResponse:
    """
    Generate an instant 1-page Land Truth Scorecard diagnostic report.
    Validates share sums, co-sharer exclusions, and seller claims.
    """
    scorecard = generate_scorecard(
        khatian_data=req.khatian_data,
        family_tree_data=req.family_tree_data,
        seller_claimed_share=req.seller_claimed_share,
        seller_name=req.seller_name,
    )

    # Optionally persist the report
    if save:
        khatian_id = req.khatian_data.get("id")
        # If no explicit id, check by khatian_no and mouza
        if not khatian_id and req.khatian_data.get("khatian_no"):
            match = (
                db.query(Khatian)
                .filter(
                    Khatian.khatian_no == str(req.khatian_data["khatian_no"]),
                    Khatian.mouza == str(req.khatian_data.get("mouza", "")),
                )
                .first()
            )
            if match:
                khatian_id = match.id

        report = AuditReport(
            khatian_id=khatian_id,
            risk_level=scorecard.risk_level,
            risk_score=scorecard.risk_score,
            checks_performed=[c.model_dump() for c in scorecard.checks],
            recommendations=scorecard.recommendations,
            scorecard_data={
                "khatian_summary": scorecard.khatian_summary,
                "seller_claimed_share": req.seller_claimed_share,
                "seller_name": req.seller_name,
            },
        )
        db.add(report)
        db.commit()
        db.refresh(report)
        scorecard.id = report.id

    return scorecard


@router.get("/{report_id}", response_model=ScorecardResponse, status_code=status.HTTP_200_OK)
def get_scorecard_by_id(report_id: int, db: Session = Depends(get_db)) -> ScorecardResponse:
    """Retrieve an existing Land Truth Scorecard report by ID."""
    report = db.query(AuditReport).filter(AuditReport.id == report_id).first()
    if not report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Scorecard report with ID {report_id} was not found.",
        )

    checks_raw = report.checks_performed or []
    checks = [AuditCheck(**c) for c in checks_raw]
    khatian_summary = (report.scorecard_data or {}).get("khatian_summary", {
        "khatian_id": report.khatian_id,
        "khatian_no": report.khatian.khatian_no if report.khatian else "N/A",
    })

    return ScorecardResponse(
        id=report.id,
        khatian_summary=khatian_summary,
        risk_level=report.risk_level,
        risk_score=report.risk_score,
        checks=checks,
        recommendations=report.recommendations or [],
        generated_at=report.generated_at,
    )
