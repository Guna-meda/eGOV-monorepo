from pydantic import BaseModel
from typing import Literal, Optional


class AnalyzeRequest(BaseModel):
    text: str
    selected_menu_path: Optional[str] = None
    selected_service_code: Optional[str] = None


class SuggestedService(BaseModel):
    serviceCode: str
    name: str
    menuPath: str
    category: str
    confidence: float


class AnalyzeResponse(BaseModel):
    urgency: Literal["high", "medium", "low"]
    urgency_signals: list[str]
    predicted_service_code: str
    predicted_menu_path: str
    suggested_service_codes: list[SuggestedService]
    confidence: list[float]
    low_confidence: bool
    menu_path_mismatch: bool
    service_code_mismatch: bool
