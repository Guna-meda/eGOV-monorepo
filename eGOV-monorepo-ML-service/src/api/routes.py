'''from fastapi import APIRouter

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
        
    }'''


from fastapi import APIRouter
from predictor import predict
from schemas import *

router = APIRouter()


@router.post("/analyze", response_model=AnalyzeResponse)
def analyze(request: AnalyzeRequest):

    return predict(request.text, request.selected_service_code)
