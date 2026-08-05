"""Unit tests for the severity model training pipeline."""
from pathlib import Path

from app.services.preprocessing import TextPreprocessor


def test_text_preprocessor_clean():
    text = "Water pipe burst in residential area causing flooding. Urgent attention needed."
    cleaned = TextPreprocessor.clean(text)
    assert "water pipe burst" in cleaned
    assert "urgent" in cleaned
    assert "http" not in cleaned
    assert "@" not in cleaned
    assert cleaned == cleaned.strip()


def test_training_script_path_exists():
    script_path = Path(__file__).resolve().parent.parent / "scripts" / "train_severity_model.py"
    assert script_path.exists()
