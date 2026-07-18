from pydantic import BaseModel


class ComplaintAnalysisRequest(BaseModel):

    complaint_id: str
    complaint_text: str


class ComplaintAnalysisResponse(BaseModel):

    complaint_id: str
    category: str
    subcategory: str
    sentiment: str
    severity_score: float
    severity_label: str
    #risk_score: float
    #risk_label: str