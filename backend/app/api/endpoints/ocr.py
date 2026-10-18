from __future__ import annotations

import os
import aiofiles
from fastapi import APIRouter, UploadFile, File, HTTPException, status
from app.config import settings
from app.schemas.khatian import OCRExtractResponse
from app.services.ocr_extractor import extract_khatian_data

router = APIRouter(prefix="/ocr", tags=["OCR Extraction"])


@router.post("/extract", response_model=OCRExtractResponse, status_code=status.HTTP_200_OK)
async def extract_khatian_image(file: UploadFile = File(...)) -> OCRExtractResponse:
    """
    Extract structured Khatian data from an uploaded scanned image (CS, SA, RS, BS).
    Uses Gemini 1.5 Flash multimodal vision API with fallback to synthetic benchmark record.
    """
    # Validate content type
    allowed_content_types = [
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/tiff",
        "application/pdf",
        "application/octet-stream",
    ]
    content_type = file.content_type or "image/jpeg"
    if content_type not in allowed_content_types and not file.filename.lower().endswith((".jpg", ".jpeg", ".png", ".webp", ".pdf")):
        raise HTTPException(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            detail=f"Unsupported file type '{content_type}'. Please upload JPEG, PNG, WEBP, or PDF.",
        )

    # Read bytes and validate size
    image_bytes = await file.read()
    max_size_bytes = settings.MAX_FILE_SIZE_MB * 1024 * 1024
    if len(image_bytes) > max_size_bytes:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"File size exceeds maximum allowed limit of {settings.MAX_FILE_SIZE_MB} MB.",
        )

    # Save to upload dir for audit trail
    if file.filename:
        save_path = os.path.join(settings.UPLOAD_DIR, file.filename)
        try:
            async with aiofiles.open(save_path, "wb") as out_file:
                await out_file.write(image_bytes)
        except Exception:
            pass  # Non-fatal if upload storage fails

    # Extract structured data
    result = await extract_khatian_data(image_bytes, mime_type=content_type)
    return OCRExtractResponse(**result)
