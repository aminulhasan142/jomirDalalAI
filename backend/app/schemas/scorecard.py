from __future__ import annotations

from datetime import datetime
from typing import List, Optional, Any
from pydantic import BaseModel, Field


class AuditCheck(BaseModel):
    check_name: str = Field(..., description="Unique check name identifier")
    status: str = Field(..., description="PASS, WARN, FAIL")
    severity: str = Field(default="INFO", description="INFO, LOW, MEDIUM, HIGH, CRITICAL")
    message: str = Field(..., description="Diagnostic message / explanation in Bengali or English")
    details: Optional[dict[str, Any]] = None


class ScorecardRequest(BaseModel):
    khatian_data: dict[str, Any] = Field(..., description="Khatian details including owners and shares")
    family_tree_data: Optional[dict[str, Any]] = Field(None, description="Optional family tree / inheritance data")
    seller_claimed_share: Optional[float] = Field(None, description="Share seller is claiming to sell")
    seller_name: Optional[str] = Field(None, description="Name of seller being audited")


class ScorecardResponse(BaseModel):
    id: Optional[int] = None
    khatian_summary: dict[str, Any]
    risk_level: str = Field(..., description="Overall risk status: GREEN, YELLOW, RED")
    risk_score: float = Field(..., description="Risk score 0-100 (higher = riskier)")
    checks: List[AuditCheck]
    recommendations: List[str]
    generated_at: datetime
