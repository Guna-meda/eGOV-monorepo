"""Unit tests for the Severity Service API."""
from fastapi.testclient import TestClient

from app.main import app


def test_health():
    """Test health endpoint returns expected status."""
    with TestClient(app) as client:
        resp = client.get("/health")
    assert resp.status_code == 200
    data = resp.json()
    assert data.get("status") == "healthy"
    assert "model_loaded" in data
    assert "embedder_loaded" in data


def test_predict():
    """Test severity prediction with complaint text."""
    payload = {
        "complaint_id": "TEST-001",
        "description": "Water pipe burst in residential area causing flooding. Urgent attention needed."
    }

    with TestClient(app) as client:
        resp = client.post("/severity", json=payload)

    assert resp.status_code == 200
    data = resp.json()
    assert "complaint_id" in data
    assert "severity_score" in data
    assert "severity_label" in data
    assert data["severity_label"] in ["LOW", "MEDIUM", "HIGH", "CRITICAL"]
    assert 0.0 <= data["severity_score"] <= 10.0
