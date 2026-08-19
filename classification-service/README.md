# classification-service

FastAPI service that predicts a complaint's service category, menu path, and urgency signals from free-text descriptions, using a trained TF-IDF + Linear SVM classifier.

## Endpoints

- `GET /` — health check
- `POST /analyze` — returns predicted service code, menu path, urgency, and confidence for a complaint description

## Running locally

```powershell
cd classification-service
python -m pip install -r requirements.txt -r requirements-dev.txt
uvicorn api_main:app --reload --port 8001
```

## Tests

```powershell
cd classification-service
pytest
```

## Models

Trained artifacts are expected under `models/category_classifier/`:
- `tfidf_vectorizer.pkl`
- `linear_svm_servicecode.pkl`
- `label_encoder.pkl`
- `servicecode_to_menupath.pkl`
