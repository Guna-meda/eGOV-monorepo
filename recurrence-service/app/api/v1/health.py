"""Health check routes for the recurrence service."""

from fastapi import APIRouter

router = APIRouter(tags=["health"])


@router.get("/health", summary="Health check", description="Returns the service health status.")
def health_check() -> dict[str, str]:
    """Return a simple health response for monitoring and deployments."""
    return {"status": "ok"}
