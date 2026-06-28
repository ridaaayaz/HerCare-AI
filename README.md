# HerCare AI

HerCare AI is a women's health awareness platform for Pakistani women. It combines a rule-based + machine learning symptom assessment tool with an AI chat companion (in English, Urdu, and Roman Urdu) covering topics like PCOS, thyroid disorders, anemia, endometriosis, menstrual irregularities, and menopause.

> ⚠️ **Medical disclaimer:** HerCare AI provides general health awareness and education only. It does **not** provide medical diagnosis or treatment. Always consult a qualified doctor for medical advice.

## Features

- **Symptom-based health assessment** — evaluates PCOS risk using a trained Random Forest model, and screens for other conditions (thyroid, anemia, endometriosis, menstrual irregularities, UTI, menopause) using rule-based symptom matching
- **AI health chatbot** — powered by Google Gemini, responds in English, Urdu, or Roman Urdu, with a fallback to canned responses when no API key is available
- **Recovery check-in tool** — flags red-flag symptoms (high fever, severe pain, abnormal wound status) after a procedure
- **Multi-language UI**

## Tech Stack

- **Backend:** Python, Flask, scikit-learn, pandas, Google Generative AI SDK
- **Frontend:** React, Vite, Framer Motion, Supabase JS client

## Project Structure

```
HerCare-AI/
├── backend/
│   ├── app.py              # Flask API server
│   ├── pcos_model.py       # PCOS model training script
│   ├── pcos_model.pkl      # Trained Random Forest model
│   ├── data/conditions.json
│   └── requirements.txt
└── frontend/
    ├── src/                # React app source
    ├── supabase/           # Supabase migrations (auth/profiles)
    └── package.json
```

## Getting Started

### Prerequisites

- Python 3.10+
- Node.js 18+ (or [Bun](https://bun.sh))
- A [Google Gemini API key](https://aistudio.google.com/apikey) (optional — the chatbot falls back to canned responses without one)

### Backend setup

```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Create a `.env` file in `backend/` with:

```
GEMINI_API_KEY=your_gemini_api_key_here
PORT=5000
```

Run the server:

```bash
python app.py
```

The API will be available at `http://localhost:5000`.

### Frontend setup

```bash
cd frontend
npm install        # or: bun install
```

Create a `.env` file in `frontend/` with your Supabase project credentials (see your Supabase project dashboard):

```
VITE_SUPABASE_PROJECT_ID=your_project_id
VITE_SUPABASE_PUBLISHABLE_KEY=your_anon_key
VITE_SUPABASE_URL=your_supabase_url
```

Run the dev server:

```bash
npm run dev         # or: bun run dev
```

The app will be available at `http://localhost:8080`.

## API Endpoints

| Method | Endpoint              | Description                                    |
|--------|------------------------|-------------------------------------------------|
| GET    | `/api/health-check`   | Backend status check                            |
| GET    | `/api/conditions`     | List of supported health conditions             |
| POST   | `/api/assess-health`  | Symptom-based risk assessment (incl. PCOS ML)   |
| POST   | `/api/check-in`       | Post-procedure recovery check-in                |
| POST   | `/api/chat`           | AI chatbot (Gemini, with offline fallback)      |

## Environment Variables

| Variable                         | Where      | Required | Description                          |
|-----------------------------------|------------|----------|---------------------------------------|
| `GEMINI_API_KEY`                  | backend    | No       | Enables live AI chat responses        |
| `PORT`                            | backend    | No       | Backend port (default `5000`)         |
| `VITE_SUPABASE_PROJECT_ID`        | frontend   | Yes      | Supabase project ID                   |
| `VITE_SUPABASE_PUBLISHABLE_KEY`   | frontend   | Yes      | Supabase anon/public key              |
| `VITE_SUPABASE_URL`               | frontend   | Yes      | Supabase project URL                  |

**Do not commit your `.env` files.** Use a `.env.example` template instead and keep real credentials local.

## Contributing

Issues and pull requests are welcome. Please open an issue first to discuss significant changes.

## License

No license has been specified yet for this project. Until one is added, all rights are reserved by the author.