"""Pydantic models for complaint input and response payloads."""

from __future__ import annotations

from typing import Any

from pydantic import BaseModel, Field


class ComplaintInput(BaseModel):
    """Input payload for recurrence analysis."""

    complaint_id: str = Field(..., description="Unique complaint identifier")
    category: str = Field(..., min_length=1, description="Complaint category")
    ward: str = Field(..., min_length=1, description="Ward identifier")
    description: str = Field(..., min_length=1, description="Complaint details")
    created_at: str = Field(..., description="Complaint creation timestamp")


class ComplaintResponse(BaseModel):
    """Response payload returned after recurrence analysis."""

    complaint_id: str
    category: str
    ward: str
    is_recurring: bool
    recurrence_score: float
    message: str
    metadata: dict[str, Any] = Field(default_factory=dict)
