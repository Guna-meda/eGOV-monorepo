# ingestion-service

Scaffold for the Kafka consumer and AI enrichment pipeline. This service will
consume complaint events off Kafka and populate the `ai_enrichment` table with
derived signals (category, urgency, recurrence, etc.) by calling the other ML
services.

**Status:** structure only — no consumer or enrichment logic is implemented yet.

## Endpoints

- `GET /` — health check

## Running locally

```powershell
cd ingestion-service
python -m pip install -r requirements.txt -r requirements-dev.txt
uvicorn app.main:app --reload --port 8002
```

## Tests

```powershell
cd ingestion-service
pytest
```
