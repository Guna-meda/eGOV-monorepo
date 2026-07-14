"""Pydantic models for recurrence analysis results."""

from __future__ import annotations

from pydantic import BaseModel, Field


class RecurrenceResult(BaseModel):
    """Represents the recurrence evaluation outcome for a complaint."""

    complaint_id: str = Field(..., description="Complaint identifier")
    category: str = Field(..., description="Complaint category")
    ward: str = Field(..., description="Ward identifier")
    is_recurring: bool = Field(..., description="Whether the complaint is considered recurring")
    recurrence_score: float = Field(..., ge=0.0, le=1.0, description="Recurrence confidence score")
    message: str = Field(..., description="Human-readable explanation")


class MonthlyComplaintCount(BaseModel):
    """Complaint count for one service in one ward during one month of one year."""

    year: int = Field(..., description="Calendar year")
    month: int = Field(..., ge=1, le=12, description="Calendar month number")
    complaint_count: int = Field(..., ge=0, description="Number of complaints")


class RecurringMonth(BaseModel):
    """Recurrence score for a calendar month across observed years."""

    month: int = Field(..., ge=1, le=12, description="Calendar month number")
    years_with_complaints: int = Field(..., ge=0, description="Distinct years with complaints in this month")
    recurrence_score: float = Field(..., ge=0.0, le=1.0, description="Month-level recurrence score")
    is_hotspot: bool = Field(..., description="Whether the month recurs in at least the configured number of years")


class WardServiceRecurrence(BaseModel):
    """Recurring month summary for one ward and service code pair."""

    ward_id: str = Field(..., description="Stable ward identifier derived from ward name when no ID is available")
    ward_name: str = Field(..., description="Ward name")
    serviceCode: str = Field(..., description="Service code or service-like category")
    recurring_months: list[RecurringMonth] = Field(default_factory=list)
    years_observed: list[int] = Field(default_factory=list, description="Dataset years observed for this ward/service pair")
    recurrence_score: float = Field(..., ge=0.0, le=1.0, description="Maximum recurrence score across months")
    is_hotspot: bool = Field(..., description="Whether any month recurs in at least the configured number of years")
    monthly_counts: list[MonthlyComplaintCount] = Field(default_factory=list)


class RecurrenceDetectionResponse(BaseModel):
    """Top-level response for batch recurrence detection."""

    total_records: int
    total_years_in_dataset: int
    years_in_dataset: list[int]
    service_code_field: str
    hotspot_threshold_years: int
    results: list[WardServiceRecurrence]
