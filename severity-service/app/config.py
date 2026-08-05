from pathlib import Path

# ==========================================================
# Base Paths
# ==========================================================

BASE_DIR = Path(__file__).resolve().parent.parent

MODEL_DIR = BASE_DIR / "models"

# ==========================================================
# Model Files (SentenceTransformer + CatBoost Pipeline)
# ==========================================================

CATBOOST_MODEL_PATH = MODEL_DIR / "severity_model.cbm"

# ==========================================================
# FastAPI
# ==========================================================

HOST = "0.0.0.0"

PORT = 8700

APP_NAME = "Severity Service"

APP_VERSION = "2.0.0"

# ==========================================================
# Prediction Range
# ==========================================================

MIN_SEVERITY = 0.0

MAX_SEVERITY = 10.0