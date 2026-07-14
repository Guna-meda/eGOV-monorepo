"""API routes for recurrence detection."""

from fastapi import APIRouter, HTTPException, status

from app.dependencies.container import get_recurrence_service
from app.models.complaint import ComplaintInput, ComplaintResponse
from app.services.recurrence_service import RecurrenceService

router = APIRouter(tags=["recurrence"])


@router.post(
    "/recurrence/analyze",
    response_model=ComplaintResponse,
    summary="Analyze recurring complaints",
    description="Analyze complaint data to detect whether complaints are recurring.",
    status_code=status.HTTP_200_OK,
)
def analyze_recurrence(payload: ComplaintInput) -> ComplaintResponse:
    """Analyze complaint input and return a recurrence assessment."""
    service: RecurrenceService = get_recurrence_service()
    try:
        return service.analyze(payload)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)) from exc
    except Exception as exc:  # pragma: no cover - defensive fallback
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Internal server error") from exc
