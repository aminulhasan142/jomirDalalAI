from __future__ import annotations

from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base


class FamilyTree(Base):
    """FamilyTree model representing the heirs/genealogy of an owner."""

    __tablename__ = "family_trees"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    owner_id = Column(Integer, ForeignKey("owners.id", ondelete="SET NULL"), nullable=True, index=True)
    deceased_name = Column(String(150), nullable=False)
    inheritance_system = Column(String(20), nullable=False, default="ISLAMIC")  # ISLAMIC or HINDU

    # Relationships
    owner = relationship("Owner", back_populates="family_trees")
    heirs = relationship("Heir", back_populates="family_tree", cascade="all, delete-orphan")

    def __repr__(self) -> str:
        return f"<FamilyTree(id={self.id}, deceased='{self.deceased_name}', system='{self.inheritance_system}')>"


class Heir(Base):
    """Heir model representing a specific heir relation and their entitled share."""

    __tablename__ = "heirs"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    family_tree_id = Column(Integer, ForeignKey("family_trees.id", ondelete="CASCADE"), nullable=False, index=True)
    relation = Column(String(50), nullable=False)  # Wife, Husband, Son, Daughter, Mother, Father
    count = Column(Integer, nullable=False, default=1)
    legal_share_fraction = Column(String(50), nullable=True)  # e.g., "1/8", "7/40"
    legal_share_decimal = Column(Float, nullable=False, default=0.0)

    # Relationships
    family_tree = relationship("FamilyTree", back_populates="heirs")

    def __repr__(self) -> str:
        return f"<Heir(id={self.id}, relation='{self.relation}', count={self.count}, share='{self.legal_share_fraction}')>"
