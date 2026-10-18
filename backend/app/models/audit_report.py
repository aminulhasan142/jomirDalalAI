from __future__ import annotations

from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


class AuditReport(Base):
    """AuditReport model representing a diagnostic Land Truth Scorecard report."""

    __tablename__ = "audit_reports"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    khatian_id = Column(Integer, ForeignKey("khatians.id", ondelete="SET NULL"), nullable=True, index=True)
    risk_level = Column(String(20), nullable=False)  # GREEN, YELLOW, RED
    risk_score = Column(Float, nullable=False, default=0.0)  # 0 to 100 risk score
    checks_performed = Column(JSON, nullable=True)  # List of check results
    recommendations = Column(JSON, nullable=True)  # Actionable advice
    scorecard_data = Column(JSON, nullable=True)  # Full diagnostic payload
    generated_at = Column(DateTime(timezone=True), server_default=func.now(), default=datetime.utcnow)

    # Relationships
    khatian = relationship("Khatian", back_populates="audit_reports")

    def __repr__(self) -> str:
        return f"<AuditReport(id={self.id}, khatian_id={self.khatian_id}, risk='{self.risk_level}', score={self.risk_score})>"
