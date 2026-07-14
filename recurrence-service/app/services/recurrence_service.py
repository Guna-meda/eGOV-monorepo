"""Business logic for recurrence detection."""

from __future__ import annotations

import math
import re
from collections import Counter, defaultdict
from datetime import datetime
from typing import Any, Protocol

from app.models.complaint import ComplaintInput, ComplaintResponse
from app.models.recurrence import (
    MonthlyComplaintCount,
    RecurrenceDetectionResponse,
    RecurringMonth,
    WardServiceRecurrence,
)


class ComplaintHistoryRepository(Protocol):
    """Repository behavior needed by recurrence analysis."""

    def get_all(self) -> list[dict[str, Any]]:
        """Return complaint history records."""


class RecurrenceService:
    """Coordinate recurrence analysis for complaint inputs."""

    def __init__(self, repository: ComplaintHistoryRepository | None = None) -> None:
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

    def detect_recurring_months(
        self,
        service_code_field: str = "category",
        hotspot_threshold_years: int = 2,
        hotspots_only: bool = True,
    ) -> RecurrenceDetectionResponse:
        """Detect recurring complaint months for each ward and service pair."""
        if self.repository is None:
            records: list[dict[str, Any]] = []
        else:
            records = self.repository.get_all()

        normalized_field = self._normalize_service_code_field(service_code_field)
        monthly_counts: Counter[tuple[str, str, int, int]] = Counter()
        ward_names_by_id: dict[str, str] = {}
        years_in_dataset: set[int] = set()
        years_by_pair: defaultdict[tuple[str, str], set[int]] = defaultdict(set)

        for record in records:
            ward_name = self._clean_text(self._get_first(record, "ward_name", "Ward Name", "ward"))
            service_code = self._clean_text(
                self._get_first(record, normalized_field, self._source_column_for_field(normalized_field))
            )
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
            return RecurrenceDetectionResponse(
                total_records=len(records),
                total_years_in_dataset=0,
                years_in_dataset=[],
                service_code_field=normalized_field,
                hotspot_threshold_years=hotspot_threshold_years,
                results=[],
            )

        for ward_id, service_code in sorted(years_by_pair):
            recurring_months: list[RecurringMonth] = []
            full_monthly_counts: list[MonthlyComplaintCount] = []
            max_recurrence_score = 0.0

            for month in range(1, 13):
                years_with_complaints = sum(
                    1 for year in sorted_years if monthly_counts[(ward_id, service_code, year, month)] > 0
                )
                recurrence_score = years_with_complaints / total_years
                max_recurrence_score = max(max_recurrence_score, recurrence_score)
                is_hotspot_month = years_with_complaints >= hotspot_threshold_years

                if is_hotspot_month:
                    recurring_months.append(
                        RecurringMonth(
                            month=month,
                            years_with_complaints=years_with_complaints,
                            recurrence_score=round(recurrence_score, 4),
                            is_hotspot=True,
                        )
                    )

                for year in sorted_years:
                    full_monthly_counts.append(
                        MonthlyComplaintCount(
                            year=year,
                            month=month,
                            complaint_count=monthly_counts[(ward_id, service_code, year, month)],
                        )
                    )

            is_hotspot = bool(recurring_months)
            if hotspots_only and not is_hotspot:
                continue

            results.append(
                WardServiceRecurrence(
                    ward_id=ward_id,
                    ward_name=ward_names_by_id[ward_id],
                    serviceCode=service_code,
                    recurring_months=recurring_months,
                    years_observed=sorted(years_by_pair[(ward_id, service_code)]),
                    recurrence_score=round(max_recurrence_score, 4),
                    is_hotspot=is_hotspot,
                    monthly_counts=full_monthly_counts,
                )
            )

        results.sort(key=lambda result: (not result.is_hotspot, -result.recurrence_score, result.ward_name, result.serviceCode))
        return RecurrenceDetectionResponse(
            total_records=len(records),
            total_years_in_dataset=total_years,
            years_in_dataset=sorted_years,
            service_code_field=normalized_field,
            hotspot_threshold_years=hotspot_threshold_years,
            results=results,
        )

    def _normalize_service_code_field(self, service_code_field: str) -> str:
        normalized = service_code_field.strip().lower().replace("-", "_")
        if normalized in {"category", "sub_category"}:
            return normalized
        if normalized in {"servicecode", "service_code", "service code"}:
            return "service_code"
        raise ValueError("service_code_field must be one of: category, sub_category, service_code")

    def _source_column_for_field(self, service_code_field: str) -> str:
        if service_code_field == "category":
            return "Category"
        if service_code_field == "sub_category":
            return "Sub Category"
        return "serviceCode"

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
