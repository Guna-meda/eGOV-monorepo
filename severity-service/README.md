Severity Service (stub)
=======================

This folder contains a FastAPI-based Severity Service that uses a trained CatBoost model for severity prediction.

Endpoints:
- `GET /health` — health check
- `POST /severity/predict` — returns severity prediction from the CatBoost model

Model placement
----------------
The service expects a CatBoost model artifact at:

- `severity-service/models/severity_model.cbm`

Training and evaluation
-----------------------
A training script is provided for the SentenceTransformer + CatBoost pipeline.

Install dependencies:
```powershell
cd severity-service
python -m pip install -r requirements.txt
```

Train the model from a labeled CSV dataset:
```powershell
cd severity-service
python scripts/train_severity_model.py path\to\severity_dataset.csv
```

The script will save:
- `severity-service/models/severity_model.cbm`
- `severity-service/models/severity_training_metrics.json`

Running the service
-------------------
Start the service:
```powershell
cd severity-service
uvicorn app.main:app --reload --port 8700
```

Test prediction:
```powershell
curl -X POST http://127.0.0.1:8700/severity/predict \
  -H "Content-Type: application/json" \
  -d '{
    "complaint_id":"TEST-001",
    "description":"Water pipe burst in residential area causing flooding. Urgent attention needed."
  }'
```

If the model is loaded successfully, the response will include:
```json
{
  "severity_score": 8.42,
  "severity_label": "High"
}
```
