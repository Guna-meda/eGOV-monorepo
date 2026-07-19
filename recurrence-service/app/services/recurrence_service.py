"""Business logic for recurrence detection."""

from __future__ import annotations

import math
import re
from calendar import month_name
from collections import Counter, defaultdict
from datetime import datetime
from typing import Any, Protocol

from app.models.recurrence import RecurringMonth, WardServiceRecurrence


class ComplaintHistoryRepository(Protocol):
    """Repository behavior needed by recurrence analysis."""

    def get_all(self) -> list[dict[str, Any]]:
        """Return complaint history records."""


class RecurrenceService:
    """Detect recurring complaints exclusively from historical CSV records."""

    HOTSPOT_THRESHOLD_YEARS = 2

    def __init__(self, repository: ComplaintHistoryRepository | None = None) -> None:
        """Initialize the service with an optional complaint repository."""
        self.repository = repository
        self._recurrence_table_cache: list[WardServiceRecurrence] | None = None

    def get_recurrence_table(self) -> list[WardServiceRecurrence]:
        """Return the complete ward and service-code recurrence table."""
        if self._recurrence_table_cache is None:
            self._recurrence_table_cache = self._build_recurrence_table()
        return self._recurrence_table_cache

    def get_ward_recurrence(self, ward_id: str) -> list[WardServiceRecurrence]:
        """Return all recurrence rows and monthly counts for one ward."""
        normalized_ward_id = self._slugify(ward_id)
        return [row for row in self.get_recurrence_table() if row.ward_id == normalized_ward_id]

    def _build_recurrence_table(self) -> list[WardServiceRecurrence]:
        """Apply the required historical month-by-year recurrence formula."""
        if self.repository is None:
            records: list[dict[str, Any]] = []
        else:
            records = self.repository.get_all()

        monthly_counts: Counter[tuple[str, str, int, int]] = Counter()
        ward_names_by_id: dict[str, str] = {}
        years_in_dataset: set[int] = set()
        years_by_pair: defaultdict[tuple[str, str], set[int]] = defaultdict(set)

        for record in records:
            ward_name = self._clean_text(self._get_first(record, "ward_name", "Ward Name", "ward"))
            service_code = self._clean_text(self._get_first(record, "serviceCode", "Category", "category"))
            grievance_date = self._parse_date(self._get_first(record, "grievance_date", "Grievance Date", "created_at"))

            if not ward_name or not service_code or grievance_date is None:
                continue

            ward_id = self._slugify(ward_name)
            year = grievance_date.year
            month = grievance_date.month
            pair = (ward_id, service_code)

            ward_names_by_id[ward_id] = ward_name
            years_in_dataset.add(year)
            years_by_pair[pair].add(year)
            monthly_counts[(ward_id, service_code, year, month)] += 1

        sorted_years = sorted(years_in_dataset)
        total_years = len(sorted_years)
        results: list[WardServiceRecurrence] = []

        if total_years == 0:
            return []

        for ward_id, service_code in sorted(years_by_pair):
            recurring_months: list[RecurringMonth] = []
            month_recurrence_scores: list[float] = []
            compact_monthly_counts = {
                str(year): [monthly_counts[(ward_id, service_code, year, month)] for month in range(1, 13)]
                for year in sorted_years
            }

            for month in range(1, 13):
                complaint_years = [
                    year for year in sorted_years if monthly_counts[(ward_id, service_code, year, month)] > 0
                ]
                if complaint_years:
                    recurrence_score = len(complaint_years) / total_years
                    month_recurrence_scores.append(recurrence_score)
                    recurring_months.append(
                        RecurringMonth(
                            month=month,
                            month_name=month_name[month],
                            years=complaint_years,
                            recurrence_score=round(recurrence_score, 4),
                            is_hotspot=len(complaint_years) >= self.HOTSPOT_THRESHOLD_YEARS,
                        )
                    )

            is_hotspot = any(month.is_hotspot for month in recurring_months)
            results.append(
                WardServiceRecurrence(
                    ward_id=ward_id,
                    ward_name=ward_names_by_id[ward_id],
                    serviceCode=service_code,
                    recurring_months=recurring_months,
                    years_observed=sorted(years_by_pair[(ward_id, service_code)]),
                    recurrence_score=round(sum(month_recurrence_scores) / len(month_recurrence_scores), 4),
                    is_hotspot=is_hotspot,
                    monthly_counts=compact_monthly_counts,
                )
            )

        results.sort(key=lambda result: (result.ward_name, result.serviceCode))
        return results

    def _get_first(self, record: dict[str, Any], *keys: str) -> Any:
        for key in keys:
            if key in record:
                return record[key]
        return None

    def _clean_text(self, value: Any) -> str:
        if value is None:
            return ""
        if isinstance(value, float) and math.isnan(value):
            return ""
        return str(value).strip()

    def _parse_date(self, value: Any) -> datetime | None:
        if isinstance(value, datetime):
            return value
        text = self._clean_text(value)
        if not text:
            return None
        try:
            return datetime.fromisoformat(text)
        except ValueError:
            return None

    def _slugify(self, value: str) -> str:
        slug = re.sub(r"[^a-z0-9]+", "-", value.lower()).strip("-")
        return slug or "unknown-ward"
