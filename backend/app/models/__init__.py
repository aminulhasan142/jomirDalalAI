from __future__ import annotations

from app.database import Base
from app.models.khatian import Khatian
from app.models.owner import Owner
from app.models.heir import FamilyTree, Heir
from app.models.audit_report import AuditReport

__all__ = [
    "Base",
    "Khatian",
    "Owner",
    "FamilyTree",
    "Heir",
    "AuditReport",
]
