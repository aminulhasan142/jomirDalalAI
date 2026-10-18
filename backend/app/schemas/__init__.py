from __future__ import annotations

from app.schemas.owner import ShareBreakdown, OwnerBase, OwnerCreate, OwnerResponse
from app.schemas.khatian import KhatianBase, KhatianCreate, KhatianResponse, OCRExtractResponse
from app.schemas.inheritance import (
    HeirInput,
    InheritanceRequest,
    HeirResult,
    InheritanceResponse,
    InheritanceAuditRequest,
    InheritanceAuditResponse,
)
from app.schemas.scorecard import AuditCheck, ScorecardRequest, ScorecardResponse

__all__ = [
    "ShareBreakdown",
    "OwnerBase",
    "OwnerCreate",
    "OwnerResponse",
    "KhatianBase",
    "KhatianCreate",
    "KhatianResponse",
    "OCRExtractResponse",
    "HeirInput",
    "InheritanceRequest",
    "HeirResult",
    "InheritanceResponse",
    "InheritanceAuditRequest",
    "InheritanceAuditResponse",
    "AuditCheck",
    "ScorecardRequest",
    "ScorecardResponse",
]
