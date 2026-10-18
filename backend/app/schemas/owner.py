from __future__ import annotations

from typing import Optional
from pydantic import BaseModel, Field, ConfigDict


class ShareBreakdown(BaseModel):
    """Traditional Bangla land measurement units."""
    ana: int = Field(default=0, ge=0, le=16, description="Ana (আনা) 0-16")
    gonda: int = Field(default=0, ge=0, le=20, description="Gonda (গণ্ডা) 0-20")
    kara: int = Field(default=0, ge=0, le=4, description="Kara (কড়া) 0-4")
    kranti: int = Field(default=0, ge=0, le=3, description="Kranti (ক্রান্তি) 0-3")


class OwnerBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=150, description="Name of the owner")
    father_name: Optional[str] = Field(None, max_length=150, description="Father's / Husband's name")
    share_text: Optional[str] = Field(None, max_length=100, description="Bangla text representation of share")
    share_ana: int = Field(default=0, ge=0)
    share_gonda: int = Field(default=0, ge=0)
    share_kara: int = Field(default=0, ge=0)
    share_kranti: int = Field(default=0, ge=0)
    calculated_decimal: float = Field(default=0.0, ge=0.0, description="Calculated area in decimals (শতাংশ)")
    ownership_percentage: float = Field(default=0.0, ge=0.0, le=100.0, description="Percentage of khatian owned")


class OwnerCreate(OwnerBase):
    share_breakdown: Optional[ShareBreakdown] = None


class OwnerResponse(OwnerBase):
    id: int
    khatian_id: int

    model_config = ConfigDict(from_attributes=True)
