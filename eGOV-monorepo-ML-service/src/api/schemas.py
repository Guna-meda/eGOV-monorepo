'''from pydantic import BaseModel


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
    #risk_label: str'''


from pydantic import BaseModel
from typing import Optional

class AnalyzeRequest(BaseModel):
    text: str
    selected_service_code: Optional[str] = None


class SuggestedService(BaseModel):
    serviceCode: str
    name: str
    category: str
    confidence: float


class AnalyzeResponse(BaseModel):
    predicted_category: str
    predicted_service_code: str

    suggested_service_codes: list[SuggestedService]

    low_confidence: bool
    possible_mismatch: bool