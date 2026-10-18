# 🏗️ জমির দালাল AI — Jomir Dalal AI

> **জমির আসল সত্য জানতে, আপনার বিশ্বস্ত ডিজিটাল সহকারী**
> *Your trusted digital assistant to know the real truth about land.*

An AI-powered **Land Copilot and Audit Engine** for Bangladesh, built for **LandTech 2026** at Daffodil International University.

---

## 🎯 What It Does

| Feature | Description |
|---------|-------------|
| 📄 **Khatian OCR** | Extracts data from scanned Bangla Khatian documents using Gemini 1.5 Flash AI |
| 🔢 **Ana-Gonda Math** | Converts traditional fractional shares (আনা-গণ্ডা-কড়া-ক্রান্তি) to decimal and percentage |
| 👨‍👩‍👧‍👦 **Inheritance Audit** | Calculates legal heir shares (Islamic Farai'd + Hindu Dayabhaga) and detects excluded co-sharers |
| 📋 **Land Truth Scorecard** | Generates a 1-page risk diagnostic with 🟢 GREEN / 🟡 YELLOW / 🔴 RED ratings |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14, TypeScript, Tailwind CSS, shadcn/ui, Recharts, Framer Motion |
| Backend | Python FastAPI, SQLAlchemy, Pydantic v2 |
| AI/OCR | Google Gemini 1.5 Flash (Multimodal Vision) |
| Database | SQLite (dev) / PostgreSQL (prod) |

---

## 🚀 Quick Start

### Prerequisites
- Python 3.11+
- Node.js 20+
- npm

### 1. Clone the repository
```bash
git clone <repo-url>
cd jomirDalalAI
```

### 2. Start the Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

The API will be available at `http://localhost:8000`.
API docs at `http://localhost:8000/docs`.

### 3. Start the Frontend
```bash
cd frontend
npm install
npm run dev
```

The app will be available at `http://localhost:3000`.

### 4. (Optional) Set up Gemini API Key
```bash
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY
```

Without a Gemini API key, the OCR feature will use demo/mock data.

---

## 🧪 Run Tests
```bash
cd backend
source venv/bin/activate
pytest -v
```

---

## 📁 Project Structure
```
jomirDalalAI/
├── frontend/          # Next.js 14 App (TypeScript + Tailwind)
├── backend/           # Python FastAPI (SQLAlchemy + Pydantic)
├── docker-compose.yml # Full stack orchestration
├── .env.example       # Environment variables template
└── README.md
```

---

## 🏆 LandTech 2026

**Track:** Digital Land Records, Verification & Digitization

**Problems Addressed:**
- **P5:** Check Before You Buy
- **P3:** Catch Fraud & Double-Selling

**Institution:** Daffodil International University

---

## 📄 License

Built for LandTech 2026 Hackathon. All rights reserved.
