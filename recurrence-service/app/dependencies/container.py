"""Dependency injection helpers for the recurrence service."""

from __future__ import annotations

from app.repositories.complaint_repository import ComplaintRepository
from app.services.ingestion_service import IngestionService
from app.services.recurrence_service import RecurrenceService


def get_recurrence_service() -> RecurrenceService:
    """Create a recurrence service instance with repository-backed dependencies."""
    ingestion_service = IngestionService()
    repository = ComplaintRepository(ingestion_service=ingestion_service)
    return RecurrenceService(repository=repository)
