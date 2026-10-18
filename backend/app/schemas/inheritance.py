from __future__ import annotations

from typing import List, Optional
from pydantic import BaseModel, Field


class HeirInput(BaseModel):
    relation: str = Field(..., description="Relation to deceased: Wife, Husband, Son, Daughter, Mother, Father")
    count: int = Field(default=1, ge=1, description="Number of heirs with this relation")


class InheritanceRequest(BaseModel):
    deceased_share: float = Field(..., gt=0, description="Total share or land decimal owned by deceased")
    heirs: List[HeirInput] = Field(..., min_length=1, description="List of living heirs")
    inheritance_system: str = Field(default="ISLAMIC", description="ISLAMIC or HINDU")


class HeirResult(BaseModel):
    relation: str
    count: int
    share_fraction: str = Field(..., description="Fractional share of deceased estate, e.g. 1/8")
    share_decimal: float = Field(..., description="Total share in land decimal/units for this heir group")
    share_percentage: float = Field(..., description="Percentage of deceased's estate")
    individual_share_decimal: Optional[float] = Field(None, description="Share per individual heir")
    individual_share_percentage: Optional[float] = Field(None, description="Percentage per individual heir")


class InheritanceResponse(BaseModel):
    deceased_share: float
    total_distributed_share: float
    inheritance_system: str
    heirs: List[HeirResult]
    warnings: List[str] = Field(default_factory=list)


class InheritanceAuditRequest(BaseModel):
    seller_claimed_share: float = Field(..., gt=0, description="Share or decimal seller is attempting to sell")
    deceased_total_share: float = Field(..., gt=0, description="Total share or decimal of deceased owner")
    seller_relation: Optional[str] = Field(None, description="Seller relation to deceased (e.g. Son, Daughter)")
    heirs: List[HeirInput] = Field(..., min_length=1, description="Complete legal heirs from family tree / Warisond")
    inheritance_system: str = Field(default="ISLAMIC", description="ISLAMIC or HINDU")


class InheritanceAuditResponse(BaseModel):
    seller_entitled_share: float
    seller_claimed_share: float
    is_valid: bool
    discrepancy: float
    risk_level: str = Field(..., description="GREEN, YELLOW, RED")
    excluded_heirs: List[str] = Field(default_factory=list)
    warnings: List[str] = Field(default_factory=list)
