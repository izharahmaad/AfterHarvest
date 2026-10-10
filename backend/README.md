# AfterHarvest Backend

FastAPI backend for the AfterHarvest mobile prototype.

## Run locally

```powershell
Set-Location backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

## Endpoints

- GET /api/v1/health
- POST /api/v1/quality/predict
- GET /api/v1/history

## Current status

This backend uses a clearly labeled demo inference engine.
It validates uploaded images, applies storage-context heuristics,
and saves assessment metadata locally.

Images are processed in memory and are not permanently stored.
