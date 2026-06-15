import joblib
import pandas as pd
from pathlib import Path


MODEL_PATH = (
    Path(__file__)
    .resolve()
    .parents[2]
    / "models"
    / "severity_model"
    / "catboost_severity.pkl"
)


model = joblib.load(MODEL_PATH)


def _label(score: float) -> str:

    if score >= 0.85:
        return "CRITICAL"

    if score >= 0.65:
        return "HIGH"

    if score >= 0.40:
        return "MEDIUM"

    return "LOW"


def predict_severity(
    category: str,
    subcategory: str,
    category_confidence: float,
    ward_complaint_density: int,
    category_geohash_density: int,
    geohash_density: int,
    ward_category_density: int,
    has_escalation: int,
    sla_hours: float
) -> dict:

    features = pd.DataFrame(
        [
            {
                "category": category,
                "subcategory": subcategory,
                "category_confidence": category_confidence,
                "ward_complaint_density": ward_complaint_density,
                "category_geohash_density": category_geohash_density,
                "geohash_density": geohash_density,
                "ward_category_density": ward_category_density,
                "has_escalation": has_escalation,
                "sla_hours": sla_hours,
            }
        ]
    )

    score = float(
        model.predict(features)[0]
    )

    score = round(
        max(0.0, min(score, 1.0)),
        3
    )

    return {
        "severity_score": score,
        "severity_label": _label(score),
    }