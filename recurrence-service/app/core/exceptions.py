"""Custom exception types for the recurrence service."""

from __future__ import annotations


class RecurrenceServiceError(Exception):
    """Base exception for recurrence-service-specific failures."""


class DataLoadError(RecurrenceServiceError):
    """Raised when a dataset cannot be loaded or validated."""


class ValidationError(RecurrenceServiceError):
    """Raised when incoming data does not meet expected requirements."""
