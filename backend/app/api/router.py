from __future__ import annotations

from fastapi import APIRouter
from app.api.endpoints.converter import router as converter_router
from app.api.endpoints.inheritance import router as inheritance_router
from app.api.endpoints.ocr import router as ocr_router
from app.api.endpoints.scorecard import router as scorecard_router
from app.api.endpoints.khatians import router as khatians_router

api_router = APIRouter()

api_router.include_router(converter_router)
api_router.include_router(inheritance_router)
api_router.include_router(ocr_router)
api_router.include_router(scorecard_router)
api_router.include_router(khatians_router)
