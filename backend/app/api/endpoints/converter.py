from __future__ import annotations

from typing import List, Dict, Any
from fastapi import APIRouter, status
from pydantic import BaseModel, Field

from app.services.khatian_math import (
    ana_gonda_to_decimal,
    decimal_to_ana_gonda,
    calculate_land_area,
    validate_shares,
    parse_bangla_share_text,
)

router = APIRouter(prefix="/converter", tags=["Ana-Gonda Converter"])


class AnaGondaRequest(BaseModel):
    ana: int = Field(default=0, ge=0, le=16, description="Ana (আনা) 0-16")
    gonda: int = Field(default=0, ge=0, le=20, description="Gonda (গণ্ডা) 0-20")
    kara: int = Field(default=0, ge=0, le=4, description="Kara (কড়া) 0-4")
    kranti: int = Field(default=0, ge=0, le=3, description="Kranti (ক্রান্তি) 0-3")


class DecimalToAnaRequest(BaseModel):
    decimal_share: float = Field(..., ge=0.0, le=1.0, description="Decimal share (0.0 to 1.0)")


class ValidateSharesRequest(BaseModel):
    shares: List[Dict[str, int]] = Field(..., min_length=1, description="List of owner share breakdowns")


class ParseBanglaRequest(BaseModel):
    text: str = Field(..., min_length=1, description="Bangla share text, e.g., '৪ আনা ৮ গণ্ডা'")


class LandAreaRequest(BaseModel):
    total_area_decimal: float = Field(..., gt=0, description="Total land area in decimals")
    ownership_decimal: float = Field(..., ge=0, le=1.0, description="Ownership share (0.0 to 1.0)")


@router.post("/ana-gonda", status_code=status.HTTP_200_OK)
def convert_ana_gonda(req: AnaGondaRequest) -> Dict[str, Any]:
    """Convert Ana-Gonda-Kara-Kranti to decimal share and percentage."""
    return ana_gonda_to_decimal(req.ana, req.gonda, req.kara, req.kranti)


@router.post("/decimal-to-ana", status_code=status.HTTP_200_OK)
def convert_decimal_to_ana(req: DecimalToAnaRequest) -> Dict[str, Any]:
    """Convert decimal share (0.0 - 1.0) back to Ana-Gonda-Kara-Kranti."""
    return decimal_to_ana_gonda(req.decimal_share)


@router.post("/validate-shares", status_code=status.HTTP_200_OK)
def validate_share_total(req: ValidateSharesRequest) -> Dict[str, Any]:
    """Validate that all owner shares sum to exactly 16 Ana (100%)."""
    return validate_shares(req.shares)


@router.post("/parse-bangla", status_code=status.HTTP_200_OK)
def parse_bangla_text(req: ParseBanglaRequest) -> Dict[str, Any]:
    """Parse Bangla share text (e.g., '৪ আনা ৮ গণ্ডা') into numeric ana/gonda units."""
    breakdown = parse_bangla_share_text(req.text)
    conversion = ana_gonda_to_decimal(
        breakdown["ana"],
        breakdown["gonda"],
        breakdown["kara"],
        breakdown["kranti"],
    )
    return {
        "raw_text": req.text,
        "breakdown": breakdown,
        "conversion": conversion,
    }


@router.post("/land-area", status_code=status.HTTP_200_OK)
def calculate_area(req: LandAreaRequest) -> Dict[str, Any]:
    """Calculate actual land area in decimals and square feet from ownership share."""
    return calculate_land_area(req.total_area_decimal, req.ownership_decimal)
