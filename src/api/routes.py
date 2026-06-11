from fastapi import APIRouter

from src.api.schemas import (
    ComplaintAnalysisRequest,
    ComplaintAnalysisResponse
)

router = APIRouter()

from predict_complaint import predict_complaint


@router.post("/ai/analyze",response_model=ComplaintAnalysisResponse)
def analyze_complaint(request: ComplaintAnalysisRequest):

    prediction = predict_complaint(request.complaint_text, translate=False)

    return {
        "complaint_id": request.complaint_id,
        "category": prediction["category"],
        "subcategory": prediction["subcategory"],
        "sentiment": prediction["sentiment_label"],
        "severity_score": prediction["severity_score"],
        "severity_label": prediction["severity_label"],
        #"risk_score": prediction["risk_score"],
        #"risk_label": prediction["risk_label"]
    }