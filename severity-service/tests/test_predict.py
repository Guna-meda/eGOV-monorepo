"""Unit tests for the Severity Service stub API."""
import os
from pathlib import Path

from fastapi.testclient import TestClient

# Allow loading the local pickle model during tests, since the service
# currently ships a pickle artifact for the severity model.
os.environ["ALLOW_PICKLE_MODELS"] = "1"
os.environ["SEVERITY_MODEL_PATH"] = str(
    Path(__file__).resolve().parents[1] / "models" / "catboost_severity.pkl"
)

from app.main import app  # noqa: E402




def test_health():
    with TestClient(app) as client:
        resp = client.get("/health")
    assert resp.status_code == 200
    assert resp.json().get("status") == "ok"


def test_predict():
    payload = {
        "category": "Water",
        "subcategory": "Leak",
        "category_confidence": 2.5,
        "ward_complaint_density": 0.75,
        "category_geohash_density": 0.6,
        "geohash_density": 0.55,
        "ward_category_density": 0.45,
        "has_escalation": False,
        "sla_hours": 48.0,
    }

    with TestClient(app) as client:
        resp = client.post("/severity/predict", json=payload)

    assert resp.status_code == 200
    data = resp.json()
    assert "severity_score" in data and "severity_label" in data
