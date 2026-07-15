"""Concrete repository for complaint-related data access."""

from __future__ import annotations

from typing import Any

from app.repositories.base import BaseRepository
from app.services.ingestion_service import IngestionService


class ComplaintRepository(BaseRepository[dict[str, Any]]):
    """Repository implementation backed by CSV ingestion."""

    def __init__(self, ingestion_service: IngestionService | None = None) -> None:
        """Initialize the repository with an ingestion service."""
        self.ingestion_service = ingestion_service or IngestionService()

    def get_all(self) -> list[dict[str, Any]]:
        """Return complaint records from every available raw CSV export."""
        return self.get_all_available()

    def get_all_available(self) -> list[dict[str, Any]]:
        """Return complaint records from every available raw CSV export."""
        records: list[dict[str, Any]] = []
        datasets = self.ingestion_service.load_all_datasets()
        for dataframe in datasets.values():
            records.extend(self.ingestion_service.to_records(dataframe))
        return records

    def get_by_id(self, identifier: str) -> dict[str, Any] | None:
        """Return a complaint record by identifier if it exists."""
        records = self.get_all()
        for record in records:
            if str(record.get("complaint_id")) == identifier:
                return record
        return None
