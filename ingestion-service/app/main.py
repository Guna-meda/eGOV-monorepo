"""FastAPI application entrypoint for the ingestion service.

This service will host the Kafka consumer and ai_enrichment pipeline.
Structure only for now — no consumer or enrichment logic is wired up yet.
"""

from __future__ import annotations

from fastapi import FastAPI

app = FastAPI(
    title="Ingestion Service",
    description="Kafka consumer and AI enrichment pipeline for complaint data.",
    version="0.1.0",
)


@app.get("/", include_in_schema=False)
async def health_check() -> dict[str, str]:
    return {"status": "ok", "service": "ingestion-service"}
