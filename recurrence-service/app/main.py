"""FastAPI application entrypoint for the recurrence service."""

from __future__ import annotations

import logging
from contextlib import asynccontextmanager
from typing import AsyncIterator

from fastapi import FastAPI, Request
from fastapi.responses import RedirectResponse

from app.api.v1.health import router as health_router
from app.api.v1.recurrence import router as recurrence_router

logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncIterator[None]:
    """Initialize application resources on startup and clean them up on shutdown."""
    logger.info("Starting recurrence service")
    try:
        yield
    finally:
        logger.info("Shutting down recurrence service")


app = FastAPI(
    title="Recurrence Service",
    description="Microservice for detecting recurring complaints using complaint data.",
    version="0.1.0",
    lifespan=lifespan,
    docs_url="/api/v1/docs",
    redoc_url="/api/v1/redoc",
    openapi_url="/api/v1/openapi.json",
)


@app.get("/", include_in_schema=False)
async def root_redirect(_request: Request) -> RedirectResponse:
    """Redirect the root URL to the API documentation."""
    return RedirectResponse(url="/api/v1/docs")

app.include_router(health_router, prefix="/api/v1")
app.include_router(recurrence_router, prefix="/api/v1")
