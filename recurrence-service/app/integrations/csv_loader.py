"""CSV-based data loading utilities for the recurrence service.

This module loads the local historical complaint CSV data used by recurrence
detection.
"""

from __future__ import annotations

import logging
from pathlib import Path
from typing import Any, Dict, Mapping, Optional, Sequence

import pandas as pd


class DataLoader:
    """Load CSV datasets from a raw data directory into pandas DataFrames.

    The loader discovers CSV files automatically, stores them in-memory using the
    filename stem as the key, validates required columns, and exposes simple
    accessors for the recurrence detector.
    """

    def __init__(
        self,
        raw_dir: str | Path | None = None,
        required_columns: Optional[Mapping[str, Sequence[str]]] = None,
        logger: Optional[logging.Logger] = None,
    ) -> None:
        """Initialize the loader with a raw data directory and optional schema rules."""
        if raw_dir is None:
            project_root = Path(__file__).resolve().parents[2]
            self.raw_dir = project_root / "data" / "raw"
        else:
            self.raw_dir = Path(raw_dir)

        self.required_columns = dict(required_columns or {})
        self.logger = logger or logging.getLogger(__name__)
        self._datasets: Dict[str, pd.DataFrame] = {}

    def load_all(self) -> Dict[str, pd.DataFrame]:
        """Discover and load all CSV files in the configured raw directory."""
        if not self.raw_dir.exists():
            self.logger.warning("Raw data directory does not exist: %s", self.raw_dir)
            return {}

        csv_files = sorted(self.raw_dir.glob("*.csv"))
        if not csv_files:
            self.logger.warning("No CSV datasets found in %s", self.raw_dir)
            return {}

        self._datasets.clear()
        for csv_path in csv_files:
            dataset_name = csv_path.stem
            self.load_csv(dataset_name)

        return dict(self._datasets)

    def load_csv(self, filename: str | Path) -> pd.DataFrame | None:
        """Load a single CSV dataset by filename and return its DataFrame.

        Args:
            filename: Dataset name or file path. Both "complaints" and
                "complaints.csv" are supported.

        Returns:
            The loaded DataFrame, or ``None`` if the file does not exist.

        Raises:
            ValueError: If the dataset is missing required columns.
        """
        file_path = self._resolve_file_path(filename)
        if file_path is None:
            self.logger.warning("Dataset not found: %s", filename)
            return None

        try:
            dataframe = pd.read_csv(file_path)
        except FileNotFoundError:
            self.logger.warning("Dataset file not found: %s", file_path)
            return None
        except pd.errors.EmptyDataError as exc:
            self.logger.error("Dataset is empty: %s", file_path)
            raise ValueError(f"Dataset is empty: {file_path}") from exc
        except Exception as exc:  # pragma: no cover - defensive fallback
            self.logger.error("Failed to load dataset %s: %s", file_path, exc)
            raise RuntimeError(f"Failed to load dataset {file_path}") from exc

        dataset_name = file_path.stem
        self._validate_columns(dataset_name, dataframe)
        self._datasets[dataset_name] = dataframe
        self.logger.info("Loaded dataset '%s' from %s", dataset_name, file_path)
        return dataframe

    def get_dataframe(self, name: str) -> pd.DataFrame | None:
        """Return a previously loaded DataFrame by dataset name."""
        if name not in self._datasets:
            self.logger.warning("Dataset '%s' is not loaded", name)
            return None
        return self._datasets[name]

    def list_available_datasets(self) -> list[str]:
        """Return the names of all loaded datasets."""
        return sorted(self._datasets.keys())

    def _resolve_file_path(self, filename: str | Path) -> Path | None:
        """Resolve a dataset name or path into a concrete CSV file path."""
        if isinstance(filename, Path):
            candidate_path = filename
        else:
            candidate_path = Path(filename)

        if candidate_path.suffix.lower() != ".csv":
            candidate_path = candidate_path.with_suffix(".csv")

        if candidate_path.is_absolute():
            file_path = candidate_path
        else:
            file_path = self.raw_dir / candidate_path

        if file_path.exists():
            return file_path
        return None

    def _validate_columns(self, dataset_name: str, dataframe: pd.DataFrame) -> None:
        """Validate that a loaded dataset contains all required columns."""
        required = self.required_columns.get(dataset_name)
        if not required:
            return

        missing_columns = [column for column in required if column not in dataframe.columns]
        if missing_columns:
            message = f"Missing required columns for '{dataset_name}': {missing_columns}"
            self.logger.error(message)
            raise ValueError(message)
