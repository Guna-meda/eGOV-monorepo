Severity Service (stub)
=======================

This folder contains a FastAPI-based Severity Service that uses a trained CatBoost model for severity prediction.

Endpoints:
- `GET /health` — health check
- `POST /severity/predict` — returns severity prediction from the CatBoost model

Model placement
----------------
Place your trained CatBoost model in the service using one of these locations:

1. Native CatBoost format (recommended):
   `severity-service/models/catboost/catboost_severity.cbm`
2. Pickle format (not recommended):
   `severity-service/models/catboost/catboost_severity.pkl`

If you use pickle, set `ALLOW_PICKLE_MODELS=1` before starting the service.

Running the service
-------------------
Install dependencies:
```powershell
cd severity-service
python -m pip install -r requirements.txt
```

Start the service:
```powershell
cd severity-service
uvicorn app.main:app --reload --port 8700
```

If you are using a pickle model:
```powershell
$env:ALLOW_PICKLE_MODELS = '1'
uvicorn app.main:app --reload --port 8700
```

Test prediction:
```powershell
curl -X POST http://127.0.0.1:8700/severity/predict \
  -H "Content-Type: application/json" \
  -d '{
    "category":"Water",
    "subcategory":"Leak",
    "category_confidence":2.5,
    "ward_complaint_density":0.75,
    "category_geohash_density":0.6,
    "geohash_density":0.55,
    "ward_category_density":0.45,
    "has_escalation":false,
    "sla_hours":48.0
  }'
```

If the model is loaded successfully, the response will include:
```json
{
  "severity_score": 8.42,
  "severity_label": "High"
}
```
