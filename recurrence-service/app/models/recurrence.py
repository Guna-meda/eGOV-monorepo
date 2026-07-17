"""Pydantic models for recurrence analysis results."""

from __future__ import annotations

from pydantic import BaseModel, Field


class RecurringMonth(BaseModel):
    """Recurrence score for a calendar month across observed years."""

    month: int = Field(..., ge=1, le=12, description="Calendar month number")
    month_name: str = Field(..., description="Calendar month name")
    years: list[int] = Field(default_factory=list, description="Distinct years with complaints in this month")
    recurrence_score: float = Field(..., ge=0.0, le=1.0, description="Month-level recurrence score")
    is_hotspot: bool = Field(..., description="Whether the month recurs in at least the configured number of years")


class WardServiceRecurrence(BaseModel):
    """Recurring month summary for one ward and service code pair."""

    ward_id: str = Field(..., description="Stable ward identifier derived from ward name when no ID is available")
    ward_name: str = Field(..., description="Ward name")
    serviceCode: str = Field(..., description="Service code or service-like category")
    recurring_months: list[RecurringMonth] = Field(default_factory=list)
    years_observed: list[int] = Field(default_factory=list, description="Dataset years observed for this ward/service pair")
    recurrence_score: float = Field(..., ge=0.0, le=1.0, description="Average recurrence score across months with complaints")
    is_hotspot: bool = Field(..., description="Whether any month recurs in at least the configured number of years")
    monthly_counts: dict[str, list[int]] = Field(
        default_factory=dict,
        description="Complaint counts by year, with January through December at indexes 0 through 11",
    )
