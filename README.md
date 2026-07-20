# eGOV ML Services Overview

This repository contains three Python/FastAPI services all served under one common FastAPI server:

## 1) `eGOV-monorepo-ML-service` (Complaint Service)
Core functionality:
- Accepts complaint text and analyzes it through `POST /analyze`.
- Predicts the most likely grievance service/category.
- Returns top service suggestions - menupath (category), serviceCode(subcategory) with confidence scores.
- Computes complaint urgency (`low`, `medium`, `high`, `critical`) with urgency signals.
- Flags potential mismatch between selected menu path and predicted category.

Test endpoint: `POST /analyze` using sample complaint text in “Try it out”.

## 2) `recurrence-service`
Core functionality:
- Ingests complaint CSV data from local raw data files.
- Computes recurrence trends by ward and service code.
- Exposes ward-specific recurrence details through `GET /api/v1/recurrence/{ward_id}`.
- Provides health status through `GET /api/v1/health`.

Test endpoint: `GET /api/v1/recurrence/{ward_id}`

## 3) `severity-service`
Core functionality:
- Loads trained ML artifacts (CatBoost model, TF-IDF vectorizer, normalization data) on startup.
- Predicts complaint severity via `POST /severity`.
- Returns `severity_score` and `severity_label` for each request.
- Exposes model/service health through `GET /health` and `GET /severity/health`.

Test endpoint: `POST /severity` with a valid severity request payload.

The main Python server endpoint: `https://ml-services-rxcs.onrender.com`