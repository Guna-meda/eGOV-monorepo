from fastapi import APIRouter, HTTPException

from app.models import (
    SeverityRequest,
    SeverityResponse
)

from app.services.prediction_service import (
    PredictionService
)

router = APIRouter(
    prefix="/severity",
    tags=["Severity Service"]
)


@router.post(
    "",
    response_model=SeverityResponse
)
async def predict_severity(request: SeverityRequest):

    try:

        prediction = PredictionService.predict(
            request
        )

        return SeverityResponse(

            complaint_id=prediction["complaint_id"],

            severity_score=prediction["severity_score"],

            severity_label=prediction["severity_label"]

        )

    except Exception as e:

        raise HTTPException(

            status_code=500,

            detail=str(e)

        )


@router.get("/health")
async def health():

    return {

        "status": "healthy",

        "service": "Severity Service"

    }