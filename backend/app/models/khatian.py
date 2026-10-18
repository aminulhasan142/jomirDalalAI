from __future__ import annotations

from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


class Khatian(Base):
    """Khatian (Bangla Land Record) model representing a cadastral land record sheet."""

    __tablename__ = "khatians"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    khatian_no = Column(String(50), nullable=False, index=True)
    khatian_type = Column(String(20), nullable=False, default="RS")  # CS, SA, RS, BS
    mouza = Column(String(100), nullable=False, index=True)
    jl_no = Column(String(50), nullable=True)
    dag_no = Column(String(50), nullable=False, index=True)  # Plot number
    total_area_decimal = Column(Float, nullable=False)
    raw_ocr_output = Column(JSON, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), default=datetime.utcnow)

    # Relationships
    owners = relationship("Owner", back_populates="khatian", cascade="all, delete-orphan")
    audit_reports = relationship("AuditReport", back_populates="khatian", cascade="all, delete-orphan")

    def __repr__(self) -> str:
        return f"<Khatian(id={self.id}, no='{self.khatian_no}', mouza='{self.mouza}', type='{self.khatian_type}')>"
