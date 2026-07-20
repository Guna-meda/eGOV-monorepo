from fastapi import APIRouter, HTTPException

from src.api.schemas import AnalyzeRequest, AnalyzeResponse
from src.classification.predictor import predict

router = APIRouter(tags=["Complaint Service"])


@router.post("/analyze", response_model=AnalyzeResponse)
def analyze(request: AnalyzeRequest):
    try:
        return predict(
            request.text,
            selected_menu_path=request.selected_menu_path,
            selected_service_code=request.selected_service_code,
        )
    except FileNotFoundError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc
