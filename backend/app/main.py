from __future__ import annotations

from contextlib import asynccontextmanager
from typing import AsyncGenerator
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.config import settings
from app.database import engine, Base, SessionLocal
from app.api.router import api_router
from app.core.logging import setup_logging
from app.data.seed_khatians import seed_database
from app.models.khatian import Khatian

logger = setup_logging(debug=settings.DEBUG)


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    """Lifespan event handler: initializes tables and seeds demo data if empty."""
    logger.info("Initializing database tables...")
    Base.metadata.create_all(bind=engine)

    # Automatically seed synthetic benchmark records if database is empty
    with SessionLocal() as db:
        if db.query(Khatian).count() == 0:
            logger.info("Database empty. Seeding initial benchmark Khatian records...")
            seed_database(db)

    logger.info(f"{settings.APP_NAME} v{settings.APP_VERSION} initialized successfully.")
    yield
    logger.info(f"Shutting down {settings.APP_NAME}...")


app = FastAPI(
    title="Jomir Dalal AI - Backend API",
    description=(
        "AI-powered Land Copilot & Audit Engine for Bangladesh Land Administration (LandTech 2026). "
        "Provides Bangla Khatian OCR extraction (Gemini 1.5 Flash), traditional Ana-Gonda fractional math conversions, "
        "Farai'd and Hindu inheritance co-sharer risk audits, and instant Land Truth Scorecard diagnostics."
    ),
    version=settings.APP_VERSION,
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount all v1 API routes
app.include_router(api_router, prefix="/api/v1")


@app.get("/health", tags=["Health & Status"])
def health_check():
    """Health check endpoint to verify backend operational readiness."""
    return {
        "status": "healthy",
        "app": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "database": "connected",
    }


@app.get("/", tags=["Health & Status"])
def root():
    """Root metadata endpoint."""
    return {
        "message": "Welcome to Jomir Dalal AI (জমির দালাল এআই) API",
        "tagline": "জমির আসল সত্য জানতে, আপনার বিশ্বস্ত ডিজিটাল সহকারী",
        "competition": "LandTech 2026",
        "docs": "/docs",
        "api_v1": "/api/v1",
    }
