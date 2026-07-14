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
