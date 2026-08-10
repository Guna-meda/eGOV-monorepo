"""Utility helpers for validating common input values."""

from __future__ import annotations


def is_non_empty_string(value: str | None) -> bool:
    """Return True when a value is a non-empty string after stripping whitespace."""
    return isinstance(value, str) and bool(value.strip())


def validate_required_fields(values: dict[str, str | None], *, field_names: list[str] | None = None) -> None:
    """Ensure that all required fields contain non-empty values."""
    required_fields = field_names or list(values.keys())
    for field_name in required_fields:
        if not is_non_empty_string(values.get(field_name)):
            raise ValueError(f"Field '{field_name}' is required and must be a non-empty string")
