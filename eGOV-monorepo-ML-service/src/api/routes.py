from fastapi import APIRouter, HTTPException

from src.api.schemas import AnalyzeRequest, AnalyzeResponse
from src.classification.predictor import predict

router = APIRouter()


@router.post("/analyze", response_model=AnalyzeResponse)
def analyze(request: AnalyzeRequest):
    try:
        return predict(request.text, request.selected_service_code)
    except FileNotFoundError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc
