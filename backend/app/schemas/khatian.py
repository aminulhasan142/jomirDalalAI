from __future__ import annotations

from datetime import datetime
from typing import List, Optional, Any
from pydantic import BaseModel, Field, ConfigDict
from app.schemas.owner import OwnerCreate, OwnerResponse


class KhatianBase(BaseModel):
    khatian_no: str = Field(..., min_length=1, max_length=50, description="Khatian number (e.g. 102)")
    khatian_type: str = Field(default="RS", description="Khatian type: CS, SA, RS, BS")
    mouza: str = Field(..., min_length=1, max_length=100, description="Mouza name")
    jl_no: Optional[str] = Field(None, max_length=50, description="J.L. number")
    dag_no: str = Field(..., min_length=1, max_length=50, description="Dag (plot) number")
    total_area_decimal: float = Field(..., gt=0, description="Total land area in decimals (শতাংশ)")


class KhatianCreate(KhatianBase):
    owners: List[OwnerCreate] = Field(default_factory=list, description="List of co-sharers/owners")
    raw_ocr_output: Optional[dict[str, Any]] = None


class KhatianResponse(KhatianBase):
    id: int
    raw_ocr_output: Optional[dict[str, Any]] = None
    created_at: datetime
    owners: List[OwnerResponse] = Field(default_factory=list)

    model_config = ConfigDict(from_attributes=True)


class OCRExtractResponse(BaseModel):
    khatian_no: str
    khatian_type: str = "RS"
    mouza: str
    jl_no: Optional[str] = None
    dag_no: str
    total_area_decimal: float
    owners: List[dict[str, Any]] = Field(default_factory=list)
    raw_text: Optional[str] = None
    confidence_notes: Optional[str] = None
