"""Business logic for recurrence detection."""

from __future__ import annotations

from typing import Any

from app.models.complaint import ComplaintInput, ComplaintResponse
from app.repositories.complaint_repository import ComplaintRepository


class RecurrenceService:
    """Coordinate recurrence analysis for complaint inputs."""

    def __init__(self, repository: ComplaintRepository | None = None) -> None:
        """Initialize the service with an optional complaint repository."""
        self.repository = repository

    def analyze(self, payload: ComplaintInput) -> ComplaintResponse:
        """Evaluate whether a complaint appears recurrent based on simple heuristics."""
        if not payload.category.strip():
            raise ValueError("Category must not be empty")

        if not payload.description.strip():
            raise ValueError("Description must not be empty")

        normalized_category = payload.category.strip().lower()
        normalized_description = payload.description.strip().lower()

        is_recurring = (
            "repeat" in normalized_description
            or "again" in normalized_description
            or "same" in normalized_description
            or normalized_category in {"water leakage", "streetlight", "garbage"}
        )

        recurrence_score = 0.85 if is_recurring else 0.2
        message = (
            "Complaint appears to be recurring based on the provided details."
            if is_recurring
            else "Complaint does not show strong recurrence signals."
        )

        return ComplaintResponse(
            complaint_id=payload.complaint_id,
            category=payload.category,
            ward=payload.ward,
            is_recurring=is_recurring,
            recurrence_score=recurrence_score,
            message=message,
            metadata={"source": "rule-based", "repository_enabled": self.repository is not None},
        )

    def get_history(self) -> list[dict[str, Any]]:
        """Return complaint history from the repository if available."""
        if self.repository is None:
            return []
        return self.repository.get_all()
