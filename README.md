# 🌾 জমির দালাল AI (Jomir Dalal AI)
> **জমির আসল সত্য জানতে, আপনার বিশ্বস্ত ডিজিটাল সহকারী**  
> *An AI-powered Land Record Audit Engine and Title Verification Copilot for Bangladesh.*

---

[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?style=flat&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Next.js](https://img.shields.io/badge/Frontend-Next.js%2014-black?style=flat&logo=next.js&logoColor=white)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind%20CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Gemini 1.5 Flash](https://img.shields.io/badge/AI%20Vision-Gemini%201.5%20Flash-4285F4?style=flat&logo=google&logoColor=white)](https://ai.google.dev/)
[![Competition](https://img.shields.io/badge/Competition-LandTech%202026-166534?style=flat)](https://daffodilvarsity.edu.bd/)

---

## 📌 Problem Statements Addressed
Built specifically for **LandTech 2026** hosted at **Daffodil International University**:
* **Track:** Digital Land Records, Verification & Digitization
* **P5: Check Before You Buy** — Ordinary buyers lack an automated way to verify whether a seller's claimed share mathematically matches historical Bangla records.
* **P3: Catch Fraud & Double-Selling** — Inherited ancestral lands frequently suffer from excluded co-sharers (wives, daughters), un-mutated shares, and fraudulent over-allocation.

---

## 🚀 Key Modules & Capabilities

### 1. 📄 Bangla Khatian OCR & Structured Extraction
* Ingests scanned legacy and modern land records (**CS, SA, RS, BS / City Survey**).
* Uses **Google Gemini 1.5 Flash Multimodal Vision** with structured JSON output mode to extract:
  * Khatian No., Dag (Plot) No., Mouza, and JL No.
  * Land area in decimal (শতক / ডেসিমেল).
  * Co-sharer names and handwritten Bengali fractional share notations (e.g., *৪ আনা ৮ গণ্ডা*).

### 2. 🔢 Ana-Gonda Fractional Share Math Engine
* Converts traditional Bengali fractional land units into exact decimal shares and ownership percentages:
  $$\text{16 Ana} = 1.0 \text{ (100\% Full Share)} = 57,600 \text{ Til}$$
  $$\text{1 Ana} = 20 \text{ Gonda} \quad|\quad \text{1 Gonda} = 4 \text{ Kara} \quad|\quad \text{1 Kara} = 3 \text{ Kranti} \quad|\quad \text{1 Kranti} = 20 \text{ Til}$$
* Validates whether all co-sharers' portions sum to exactly 16 Ana (100%), catching over-allocation and double-selling before registration.

### 3. 👨‍👩‍👧‍👦 Farai'd & Dayabhaga Inheritance Audit Engine
* Calculates precise legal shares based on **Islamic Farai'd** (Quranic fixed sharers, residuary Asaba 2:1 son-to-daughter ratios, Awl proportional reduction, and Radd return) and **Hindu Dayabhaga** rules.
* Cross-checks the seller's claimed share against their actual inheritance entitlement, instantly flagging un-mutated ancestral property or excluded legal heirs.

### 4. 📋 1-Page Land Truth Scorecard
Generates an objective, color-coded title verification report:
* 🟢 **GREEN (Clear Title)**: Mathematical shares balance and all heirs/co-sharers are accounted for.
* 🟡 **YELLOW (Minor Warning)**: Fractional rounding discrepancy or pending mutation.
* 🔴 **RED (High Risk)**: Excluded legal heirs, un-mutated ancestral share, or over-claimed selling area.
* Printable & exportable directly to **PDF** for buyers, financial institutions, and sub-registry offices.

---

## 🏗️ Architecture & Tech Stack

```
jomirDalalAI/
├── backend/                  # Python FastAPI Backend
│   ├── app/
│   │   ├── api/              # RESTful API endpoints & versioned routing (/api/v1)
│   │   ├── core/             # Logging, exceptions, and security
│   │   ├── data/             # Synthetic benchmark datasets (CS, SA, RS, BS)
│   │   ├── models/           # SQLAlchemy ORM models (Khatian, Owner, Heir, Scorecard)
│   │   ├── schemas/          # Pydantic v2 validation models
│   │   └── services/         # Core engines (khatian_math, faraid_engine, ocr, scorecard)
│   ├── tests/                # Automated pytest test suite (22 unit & integration tests)
│   ├── requirements.txt
│   └── Dockerfile
│
├── frontend/                 # Next.js 14 App Router (TypeScript + Tailwind CSS)
│   ├── src/
│   │   ├── app/              # Routes: /, /upload, /converter, /inheritance, /analyze, /scorecard
│   │   ├── components/       # Enterprise UI components (shadcn/ui primitives + land tools)
│   │   ├── lib/              # API clients, calculations engine, and types
│   │   └── scripts/          # Tailwind CSS v4 compiler pipeline
│   ├── package.json
│   └── Dockerfile
│
├── docker-compose.yml        # Multi-container orchestration
├── .env.example              # Environment variables template
└── README.md
```

---

## ⚡ Getting Started

### Prerequisites
* **Python 3.10+**
* **Node.js 18+** & **npm**

### 1. Clone & Set Up Environment
```bash
git clone https://github.com/aminulhasan142/jomirDalalAI.git
cd jomirDalalAI
cp .env.example .env
```

### 2. Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate       # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
* **Swagger API Docs**: `http://localhost:8000/docs`
* **Health Check**: `http://localhost:8000/health`

### 3. Frontend Setup
In a new terminal:
```bash
cd frontend
npm install
npm run dev
```
Open **`http://localhost:3000`** in your browser.

---

## 🧪 Testing & Verification

Run the comprehensive automated test suite for the math engine, Farai'd inheritance calculator, and scorecard diagnostics:

```bash
cd backend
source venv/bin/activate
pytest -v
```

```text
============================== 22 passed in 0.09s ==============================
tests/test_faraid_engine.py .....                        [ 22%]
tests/test_khatian_math.py ..........                    [ 68%]
tests/test_scorecard.py .......                          [100%]
```

---

## 🛡️ Benchmark Compliance & Data Ethics
In accordance with the hackathon rulebook:
* **Zero Live Scraping**: Does not scrape government land portals.
* **Zero Real PII**: Employs synthetic benchmark datasets and simulated family trees for evaluation and demonstrations.

---

## 👥 Hackathon Team & Acknowledgments
* **Competition:** LandTech 2026
* **Institution:** Daffodil International University (DIU)
* **License:** MIT License
