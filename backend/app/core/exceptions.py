from __future__ import annotations

from typing import Any, Optional
from fastapi import HTTPException, status


class JomirDalalException(HTTPException):
    """Base exception for Jomir Dalal AI application."""

    def __init__(
        self,
        status_code: int = status.HTTP_400_BAD_REQUEST,
        detail: str = "An error occurred during land record processing.",
        extra: Optional[dict[str, Any]] = None,
    ):
        super().__init__(status_code=status_code, detail=detail)
        self.extra = extra or {}


class KhatianNotFoundException(JomirDalalException):
    def __init__(self, khatian_id: int):
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Khatian with ID {khatian_id} was not found.",
        )


class InvalidShareException(JomirDalalException):
    def __init__(self, detail: str = "Invalid fractional share configuration."):
        super().__init__(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=detail,
        )


class OCRProcessingException(JomirDalalException):
    def __init__(self, detail: str = "Failed to process Khatian image with OCR."):
        super().__init__(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=detail,
        )


class InheritanceException(JomirDalalException):
    def __init__(self, detail: str = "Error calculating legal inheritance distribution."):
        super().__init__(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=detail,
        )
