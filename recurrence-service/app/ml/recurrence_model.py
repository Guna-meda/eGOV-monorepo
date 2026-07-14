"""Placeholder ML-oriented recurrence analysis module."""

from __future__ import annotations

from app.models.complaint import ComplaintInput, ComplaintResponse


class RecurrenceModel:
    """A thin wrapper for future ML-based recurrence scoring."""

    def predict(self, payload: ComplaintInput) -> ComplaintResponse:
        """Return a deterministic placeholder response until a real model is integrated."""
        return ComplaintResponse(
            complaint_id=payload.complaint_id,
            category=payload.category,
            ward=payload.ward,
            is_recurring=False,
            recurrence_score=0.0,
            message="ML model integration pending",
            metadata={"model": "placeholder"},
        )
