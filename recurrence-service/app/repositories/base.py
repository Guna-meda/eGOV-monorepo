"""Base abstractions for repository implementations."""

from __future__ import annotations

from abc import ABC, abstractmethod
from typing import Generic, TypeVar

T = TypeVar("T")


class BaseRepository(ABC, Generic[T]):
    """Define a minimal repository contract for data access."""

    @abstractmethod
    def get_all(self) -> list[T]:
        """Return all records from the underlying data source."""

    @abstractmethod
    def get_by_id(self, identifier: str) -> T | None:
        """Return a single record by identifier if it exists."""
