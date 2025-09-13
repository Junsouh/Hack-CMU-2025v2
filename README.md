# Grocery Inventory (hackathon-ready)

## Quick start (local)

1. Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python app.py
```

2. Frontend (dev)

```bash
cd frontend
npm install
npm run dev
# open http://localhost:5173 (or check terminal for the port)
```

## Quick start (docker-compose)

```bash
docker compose up --build
# frontend -> http://localhost:3000
# backend -> http://localhost:8000/api
```

Notes:

- Frontend expects API at `http://localhost:8000/api`. To change, set `VITE_API_BASE` env var before building.
- This is a minimal, extendable codebase: add user auth, image scanning, ingredient-parsing, or recipe-finding via external APIs for next-level features.
