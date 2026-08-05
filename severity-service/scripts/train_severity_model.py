"""Train a SentenceTransformer + CatBoost severity model.

This script trains a CatBoost regressor on complaint text and a numeric severity target.
It also evaluates on a held-out test split and prints regression/classification metrics.

Expected input CSV columns:
- description: complaint text
- severity_score: numeric target between 0 and 10 (preferred)
- severity_label: optional categorical target in [LOW, MEDIUM, HIGH, CRITICAL]

If only severity_label is provided, the script converts labels to numeric score midpoints.
"""

from __future__ import annotations

import argparse
import json
from pathlib import Path
from typing import Any

import numpy as np
import pandas as pd
from catboost import CatBoostRegressor
from sklearn.metrics import (
    accuracy_score,
    classification_report,
    mean_absolute_error,
    mean_squared_error,
    r2_score,
)
from sklearn.model_selection import train_test_split


LABEL_SCORE_MAPPING = {
    "LOW": 1.5,
    "MEDIUM": 4.5,
    "HIGH": 7.0,
    "CRITICAL": 9.0,
}


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Train a SentenceTransformer + CatBoost severity model."
    )
    parser.add_argument(
        "input_csv",
        type=Path,
        help="Path to a CSV dataset with complaint text and severity labels.",
    )
    parser.add_argument(
        "--output-model",
        type=Path,
        default=Path(__file__).resolve().parent.parent / "models" / "severity_model.cbm",
        help="Output CatBoost model path.",
    )
    parser.add_argument(
        "--embedder",
        default="all-MiniLM-L6-v2",
        help="SentenceTransformer model to use for embedding complaint text.",
    )
    parser.add_argument(
        "--test-size",
        type=float,
        default=0.2,
        help="Proportion of data held out for test evaluation.",
    )
    parser.add_argument(
        "--random-seed",
        type=int,
        default=42,
        help="Random seed for reproducibility.",
    )
    parser.add_argument(
        "--metrics-output",
        type=Path,
        default=Path(__file__).resolve().parent.parent / "models" / "severity_training_metrics.json",
        help="Optional JSON file to write metrics to.",
    )
    return parser.parse_args()


def label_to_score(label: str) -> float:
    cleaned = str(label).strip().upper()
    if cleaned not in LABEL_SCORE_MAPPING:
        raise ValueError(f"Unknown severity label: {label}")
    return LABEL_SCORE_MAPPING[cleaned]


def score_to_label(score: float) -> str:
    if score < 3:
        return "LOW"
    if score < 6:
        return "MEDIUM"
    if score < 8:
        return "HIGH"
    return "CRITICAL"


def build_dataset(path: Path) -> pd.DataFrame:
    df = pd.read_csv(path)
    if "description" not in df.columns:
        raise ValueError("Input CSV must contain a 'description' column.")

    if "severity_score" not in df.columns and "severity_label" not in df.columns:
        raise ValueError(
            "Input CSV must contain either 'severity_score' or 'severity_label'."
        )

    if "severity_score" not in df.columns:
        df["severity_score"] = df["severity_label"].apply(label_to_score)

    if df["severity_score"].isna().any():
        raise ValueError("Severity scores contain missing values.")

    return df[["description", "severity_score"]].dropna()


def get_embeddings(texts: list[str], embedder_name: str) -> np.ndarray:
    from sentence_transformers import SentenceTransformer

    embedder = SentenceTransformer(embedder_name)
    return embedder.encode(texts, convert_to_numpy=True, show_progress_bar=True)


def train_model(
    input_csv: Path,
    output_model: Path,
    embedder_model: str,
    test_size: float,
    random_seed: int,
    metrics_output: Path,
) -> None:
    from app.services.preprocessing import TextPreprocessor

    output_model.parent.mkdir(parents=True, exist_ok=True)
    metrics_output.parent.mkdir(parents=True, exist_ok=True)

    df = build_dataset(input_csv)
    df["clean_text"] = df["description"].astype(str).apply(TextPreprocessor.clean)

    X = get_embeddings(df["clean_text"].tolist(), embedder_model)
    y = df["severity_score"].astype(float).to_numpy()

    X_train, X_test, y_train, y_test = train_test_split(
        X,
        y,
        test_size=test_size,
        random_state=random_seed,
        shuffle=True,
    )

    model = CatBoostRegressor(
        iterations=500,
        learning_rate=0.05,
        depth=6,
        random_seed=random_seed,
        loss_function="RMSE",
        verbose=100,
    )
    model.fit(X_train, y_train)

    preds = model.predict(X_test)
    preds_clamped = np.clip(preds, 0.0, 10.0)
    y_test_clamped = np.clip(y_test, 0.0, 10.0)

    metrics: dict[str, Any] = {
        "rmse": mean_squared_error(y_test_clamped, preds_clamped, squared=False),
        "mae": mean_absolute_error(y_test_clamped, preds_clamped),
        "r2": r2_score(y_test_clamped, preds_clamped),
        "test_size": len(y_test),
        "embedder": embedder_model,
        "model_path": str(output_model),
    }

    y_test_labels = [score_to_label(float(v)) for v in y_test_clamped]
    pred_labels = [score_to_label(float(v)) for v in preds_clamped]

    metrics["classification"] = {
        "accuracy": accuracy_score(y_test_labels, pred_labels),
        "report": classification_report(y_test_labels, pred_labels, digits=4),
    }

    model.save_model(str(output_model))

    with metrics_output.open("w", encoding="utf-8") as fh:
        json.dump(metrics, fh, indent=2)

    print("\nTraining complete.")
    print(f"Model saved to: {output_model}")
    print("Metrics:")
    print(json.dumps(metrics, indent=2))


def main() -> None:
    args = parse_args()
    train_model(
        input_csv=args.input_csv,
        output_model=args.output_model,
        embedder_model=args.embedder,
        test_size=args.test_size,
        random_seed=args.random_seed,
        metrics_output=args.metrics_output,
    )


if __name__ == "__main__":
    main()
