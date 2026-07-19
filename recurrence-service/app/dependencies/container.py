"""Dependency injection helpers for the recurrence service."""

from __future__ import annotations

from functools import lru_cache

from app.integrations.csv_loader import DataLoader
from app.repositories.complaint_repository import ComplaintRepository
from app.services.ingestion_service import IngestionService
from app.services.recurrence_service import RecurrenceService


@lru_cache(maxsize=1)
def get_recurrence_service() -> RecurrenceService:
    """Create a recurrence service instance with repository-backed dependencies."""
    ingestion_service = IngestionService(
        loader=DataLoader(usecols=["Category", "Grievance Date", "Ward Name"])
    )
    repository = ComplaintRepository(ingestion_service=ingestion_service)
    return RecurrenceService(repository=repository)
