"""Service for loading complaint datasets into a reusable format."""

from __future__ import annotations

from typing import Any

import pandas as pd

from app.integrations.csv_loader import DataLoader


class IngestionService:
    """Load and prepare datasets for recurrence analysis."""

    def __init__(self, loader: DataLoader | None = None) -> None:
        """Initialize the ingestion service with a data loader."""
        self.loader = loader or DataLoader()

    def load_dataset(self, name: str, required_columns: list[str] | None = None) -> pd.DataFrame:
        """Load a dataset by name and validate its columns."""
        dataframe = self.loader.load_csv(name)
        if dataframe is None:
            raise FileNotFoundError(f"Dataset '{name}' was not found")

        if required_columns:
            missing_columns = [column for column in required_columns if column not in dataframe.columns]
            if missing_columns:
                raise ValueError(f"Missing required columns: {missing_columns}")

        return dataframe

    def load_all_datasets(self, required_columns_by_dataset: dict[str, list[str]] | None = None) -> dict[str, pd.DataFrame]:
        """Load all available datasets from the raw directory."""
        datasets = self.loader.load_all()
        if required_columns_by_dataset is None:
            return datasets

        for dataset_name, required_columns in required_columns_by_dataset.items():
            if dataset_name not in datasets:
                continue
            missing_columns = [column for column in required_columns if column not in datasets[dataset_name].columns]
            if missing_columns:
                raise ValueError(f"Missing required columns for '{dataset_name}': {missing_columns}")

        return datasets

    def to_records(self, dataframe: pd.DataFrame) -> list[dict[str, Any]]:
        """Convert a DataFrame into a list of dictionaries for API or service use."""
        return dataframe.to_dict(orient="records")
