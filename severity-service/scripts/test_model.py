"""Quick script to test the CatBoost model loader and prediction."""
from __future__ import annotations

import os
import json
import logging
from pathlib import Path

from app import model_loader


def main() -> None:
    logging.basicConfig(level=logging.INFO)
    # Allow pickle models for this test (only run in trusted dev environment)
    os.environ["ALLOW_PICKLE_MODELS"] = "1"

    # Optionally override model path via env var
    model_path = os.getenv(
        "SEVERITY_MODEL_PATH",
        str(
            Path(__file__).resolve().parents[2]
            / ".."
            / "eGOV-monorepo-ML-service"
            / "models"
            / "severity_model"
            / "catboost_severity.pkl"
        ),
    )

    print("Using model path:", model_path)
    model_loader.init_model(model_path)

    features = {
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
    try:
        score = model_loader.predict(features)
        print("Predicted severity:", score)
    except Exception as exc:
        print("Prediction failed:", exc)


if __name__ == "__main__":
    main()
