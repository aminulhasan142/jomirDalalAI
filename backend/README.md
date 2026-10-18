# Jomir Dalal AI — Backend API (জমির দালাল এআই)

> **জমির আসল সত্য জানতে, আপনার বিশ্বস্ত ডিজিটাল সহকারী**  
> AI-powered Land Record Audit & Inheritance Engine for Bangladesh (LandTech 2026)

## Features

1. **Bangla Khatian OCR (`/api/v1/ocr/extract`)**:
   - Multimodal OCR with Gemini 1.5 Flash Vision.
   - Extracts Khatian No, Mouza, JL No, Dag No, co-sharer names, and fractional shares.
   - Fallback mock mode using benchmark synthetic data when API key is unconfigured.

2. **Ana-Gonda Fractional Math Engine (`/api/v1/converter/*`)**:
   - Full 16-Ana traditional conversion (`16 Ana = 1 Full Share = 57,600 Til`).
   - Converts `(ana, gonda, kara, kranti)` to decimal share and percentage.
   - Parses natural Bengali share text (e.g., `৪ আনা ৮ গণ্ডা`).
   - Validates that co-sharer portions sum to 100%.

3. **Farai'd & Hindu Inheritance Engine (`/api/v1/inheritance/*`)**:
   - Full Hanafi Islamic inheritance math with exact fractions (`fractions.Fraction`).
   - Calculates fixed shares (Spouse, Mother, Father) and residual distribution (Sons 2x Daughters).
   - Handles Awl (عول) and Radd (رد) proportionality rules.
   - Hindu Dayabhaga inheritance support (equal child shares + surviving spouse equal share).
   - Inheritance Co-Sharer Audit detects illegally excluded female heirs (daughters/wives) and over-allocated seller claims.

4. **Land Truth Scorecard (`/api/v1/scorecard/*`)**:
   - 1-Page diagnostic report with Green / Yellow / Red risk rating and numerical score (0-100).
   - Detailed check list (`AuditCheck`) with actionable Bengali/English legal recommendations.

5. **Khatian Management & Synthetic Benchmark Seeding (`/api/v1/khatians`)**:
   - Pre-seeded with 5 realistic synthetic benchmark land records (Dhanmondi, Mirpur, Gulshan, Uttara, Savar).
   - Zero live government portal scraping, zero personal data (rulebook compliant).

## Getting Started

### Installation
```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### Running the Server
```bash
uvicorn app.main:app --reload --port 8000
```
Interactive API documentation:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

### Running Tests
```bash
pytest
```
All 22 unit and integration tests run with 100% pass rate.
