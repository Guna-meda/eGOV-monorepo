"""Utility functions for working with pandas DataFrames."""

from __future__ import annotations

import pandas as pd


def normalize_text_columns(dataframe: pd.DataFrame, columns: list[str]) -> pd.DataFrame:
    """Return a copy of the DataFrame with selected text columns normalized to lowercase."""
    normalized = dataframe.copy()
    for column in columns:
        if column in normalized.columns:
            normalized[column] = normalized[column].astype(str).str.strip().str.lower()
    return normalized


def drop_missing_values(dataframe: pd.DataFrame, columns: list[str]) -> pd.DataFrame:
    """Drop rows that are missing values in the selected columns."""
    subset = [column for column in columns if column in dataframe.columns]
    if not subset:
        return dataframe.copy()
    return dataframe.dropna(subset=subset).copy()
