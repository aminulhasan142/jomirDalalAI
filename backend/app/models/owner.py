from __future__ import annotations

from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base


class Owner(Base):
    """Owner model representing a recorded owner / co-sharer in a Khatian."""

    __tablename__ = "owners"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    khatian_id = Column(Integer, ForeignKey("khatians.id", ondelete="CASCADE"), nullable=False, index=True)
    name = Column(String(150), nullable=False)
    father_name = Column(String(150), nullable=True)
    share_text = Column(String(100), nullable=True)  # Bangla fractional share text, e.g., '৪ আনা ৮ গণ্ডা'
    share_ana = Column(Integer, nullable=False, default=0)
    share_gonda = Column(Integer, nullable=False, default=0)
    share_kara = Column(Integer, nullable=False, default=0)
    share_kranti = Column(Integer, nullable=False, default=0)
    calculated_decimal = Column(Float, nullable=False, default=0.0)
    ownership_percentage = Column(Float, nullable=False, default=0.0)

    # Relationships
    khatian = relationship("Khatian", back_populates="owners")
    family_trees = relationship("FamilyTree", back_populates="owner", cascade="all, delete-orphan")

    def __repr__(self) -> str:
        return f"<Owner(id={self.id}, name='{self.name}', share_text='{self.share_text}')>"
