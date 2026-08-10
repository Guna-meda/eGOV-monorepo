from pydantic import BaseModel, Field


class SeverityRequest(BaseModel):

    complaint_id: str = Field(
        ...,
        description="Unique Complaint ID"
    )

    description: str = Field(
        ...,
        description="Citizen Complaint Text"
    )


class SeverityResponse(BaseModel):

    complaint_id: str

    severity_score: float

    severity_label: str