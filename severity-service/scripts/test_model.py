"""Quick script to test the CatBoost model and SentenceTransformer embedder."""
from __future__ import annotations

import sys
import logging
from pathlib import Path

# Add parent directory to path to import app
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from app.model_loader import ModelLoader
from app.models import SeverityRequest
from app.services.prediction_service import PredictionService


def main() -> None:
    """Load model and test prediction with sample complaint text."""
    logging.basicConfig(level=logging.INFO)

    try:
        ModelLoader.load()
        print("✓ CatBoost model loaded successfully")

        request = SeverityRequest(
            complaint_id="TEST-001",
            description="Water pipe burst in residential area causing flooding. Urgent attention needed."
        )

        result = PredictionService.predict(request)
        print("\nPrediction Result:")
        print(f"  Complaint ID: {result['complaint_id']}")
        print(f"  Severity Score: {result['severity_score']}")
        print(f"  Severity Label: {result['severity_label']}")

    except Exception as exc:
        logging.exception("Model test failed")
        raise


if __name__ == "__main__":
    main()
