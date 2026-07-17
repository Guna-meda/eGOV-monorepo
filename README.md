# eGOV Monorepo Services Overview

This repository contains three Python/FastAPI services:

## 1) `eGOV-monorepo-ML-service` (Complaint Service)
Core functionality:
- Accepts complaint text and analyzes it through `POST /analyze`.
- Predicts the most likely grievance service/category.
- Returns top service suggestions with confidence scores.
- Computes complaint urgency (`low`, `medium`, `high`) with urgency signals.
- Flags potential mismatch between selected menu path and predicted category.

Swagger API testing:
1. Start the service:
   ```bash
   cd /home/runner/work/eGOV-monorepo/eGOV-monorepo/eGOV-monorepo-ML-service
   pip install -r requirements.txt
   uvicorn api_main:app --reload --port 8080
   ```
2. Open Swagger UI: `http://127.0.0.1:8080/docs`
3. Test endpoint: `POST /analyze` using sample complaint text in “Try it out”.

## 2) `recurrence-service`
Core functionality:
- Ingests complaint CSV data from local raw data files.
- Computes recurrence trends by ward and service code.
- Exposes full recurrence table through `GET /api/v1/recurrence`.
- Exposes ward-specific recurrence details through `GET /api/v1/recurrence/{ward_id}`.
- Provides health status through `GET /api/v1/health`.

Swagger API testing:
1. Start the service:
   ```bash
   cd /home/runner/work/eGOV-monorepo/eGOV-monorepo/recurrence-service
   pip install -r requirements.txt
   uvicorn app.main:app --reload --port 8080
   ```
2. Open Swagger UI: `http://127.0.0.1:8080/api/v1/docs`
3. Test endpoints:
   - `GET /api/v1/recurrence`
   - `GET /api/v1/recurrence/{ward_id}`

## 3) `severity-service`
Core functionality:
- Loads trained ML artifacts (CatBoost model, TF-IDF vectorizer, normalization data) on startup.
- Predicts complaint severity via `POST /severity`.
- Returns `severity_score` and `severity_label` for each request.
- Exposes model/service health through `GET /health` and `GET /severity/health`.

Swagger API testing:
1. Start the service:
   ```bash
   cd /home/runner/work/eGOV-monorepo/eGOV-monorepo/severity-service
   pip install -r requirements.txt
   uvicorn app.main:app --reload --port 8080
   ```
2. Open Swagger UI: `http://127.0.0.1:8080/docs`
3. Test endpoint: `POST /severity` with a valid severity request payload.
