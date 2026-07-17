"""API routes for recurrence detection."""

from fastapi import APIRouter, HTTPException, status

from app.dependencies.container import get_recurrence_service
from app.models.recurrence import WardServiceRecurrence
from app.services.recurrence_service import RecurrenceService

router = APIRouter(tags=["recurrence"])


@router.get(
    "/recurrence",
    response_model=list[WardServiceRecurrence],
    summary="Full ward recurrence table",
    description="Calculate recurrence from historical complaint CSV data in the local data folder.",
)
def get_recurrence_table() -> list[WardServiceRecurrence]:
    """Return recurrence data for every ward and service code."""
    service: RecurrenceService = get_recurrence_service()
    try:
        return service.get_recurrence_table()
    except Exception as exc:  # pragma: no cover - defensive fallback
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Internal server error") from exc


@router.get(
    "/recurrence/{ward_id}",
    response_model=list[WardServiceRecurrence],
    summary="Single ward recurrence detail",
    description="Return the ward's service-code recurrence rows with monthly complaint counts.",
)
def get_ward_recurrence(ward_id: str) -> list[WardServiceRecurrence]:
    """Return recurrence data for one ward."""
    service: RecurrenceService = get_recurrence_service()
    try:
        results = service.get_ward_recurrence(ward_id)
    except Exception as exc:  # pragma: no cover - defensive fallback
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Internal server error") from exc

    if not results:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Ward not found")
    return results
