"""API routes for recurrence detection."""

from fastapi import APIRouter, HTTPException, Query, status

from app.dependencies.container import get_recurrence_service
from app.models.complaint import ComplaintInput, ComplaintResponse
from app.models.recurrence import RecurrenceDetectionResponse
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


@router.get(
    "/recurrence/detect",
    response_model=RecurrenceDetectionResponse,
    summary="Detect recurring complaint months",
    description="Aggregate complaint history by ward, service code, month, and year to identify recurring hotspots.",
)
def detect_recurrence(
    service_code_field: str = Query(
        default="category",
        description="Complaint field to use as serviceCode: category, sub_category, or service_code.",
    ),
    hotspot_threshold_years: int = Query(
        default=2,
        ge=1,
        description="Minimum distinct years with complaints in the same calendar month to flag a hotspot.",
    ),
    hotspots_only: bool = Query(
        default=True,
        description="Return only ward/service pairs that have at least one recurring month.",
    ),
) -> RecurrenceDetectionResponse:
    """Detect recurrent complaint months from available complaint history."""
    service: RecurrenceService = get_recurrence_service()
    try:
        return service.detect_recurring_months(
            service_code_field=service_code_field,
            hotspot_threshold_years=hotspot_threshold_years,
            hotspots_only=hotspots_only,
        )
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)) from exc
    except Exception as exc:  # pragma: no cover - defensive fallback
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Internal server error") from exc
