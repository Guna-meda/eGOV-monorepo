from pydantic import BaseModel, Field


class SeverityRequest(BaseModel):

    complaint_id: str = Field(
        ...,
        description="Unique Complaint ID"
    )

    description: str = Field(
        ...,
        description="Citizen complaint text"
    )

    category: str = Field(
        default="Unknown",
        description="Complaint Category"
    )

    subcategory: str = Field(
        default="Unknown",
        description="Complaint Subcategory"
    )

    ward: str = Field(
        default="Unknown",
        description="Ward Name"
    )

    sla_hours: float = Field(
        default=0,
        ge=0,
        description="Current SLA elapsed in hours"
    )

    status: str = Field(
        default="OPEN",
        description="Workflow Status"
    )

    escalation_level: int = Field(
        default=0,
        ge=0,
        description="Workflow Escalation Level"
    )


class SeverityResponse(BaseModel):

    complaint_id: str

    severity_score: float

    severity_label: str