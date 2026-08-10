"""Common FastAPI entrypoint for the eGOV ML services.

This file exposes the individual service endpoints from one Render-friendly
server:

- POST /analyze
- GET /recurrence
- POST /severity
"""

from __future__ import annotations

import importlib
import os
import sys
from contextlib import contextmanager
from pathlib import Path
from types import ModuleType
from typing import Iterator

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware


BASE_DIR = Path(__file__).resolve().parent

ML_SERVICE_DIR = BASE_DIR / "eGOV-monorepo-ML-service"
RECURRENCE_SERVICE_DIR = BASE_DIR / "recurrence-service"
SEVERITY_SERVICE_DIR = BASE_DIR / "severity-service"


@contextmanager
def service_import_context(service_dir: Path, package_roots: tuple[str, ...]) -> Iterator[None]:
    """Temporarily import modules from a service with isolated package names."""
    original_path = sys.path[:]
    removed_modules: dict[str, ModuleType] = {}

    for module_name in list(sys.modules):
        if module_name in package_roots or module_name.startswith(tuple(f"{root}." for root in package_roots)):
            removed_modules[module_name] = sys.modules.pop(module_name)

    sys.path.insert(0, str(service_dir))

    try:
        yield
    finally:
        for module_name in list(sys.modules):
            if module_name in package_roots or module_name.startswith(tuple(f"{root}." for root in package_roots)):
                sys.modules.pop(module_name, None)

        sys.modules.update(removed_modules)
        sys.path = original_path


with service_import_context(ML_SERVICE_DIR, ("src",)):
    ml_routes = importlib.import_module("src.api.routes")
    analyze_router = ml_routes.router

with service_import_context(RECURRENCE_SERVICE_DIR, ("app",)):
    recurrence_routes = importlib.import_module("app.api.v1.recurrence")
    recurrence_health_routes = importlib.import_module("app.api.v1.health")
    recurrence_router = recurrence_routes.router
    recurrence_health_router = recurrence_health_routes.router

with service_import_context(SEVERITY_SERVICE_DIR, ("app",)):
    severity_routes = importlib.import_module("app.api.predict")
    severity_model_loader = importlib.import_module("app.model_loader")
    severity_router = severity_routes.router
    SeverityModelLoader = severity_model_loader.ModelLoader


app = FastAPI(
    title="eGOV Common ML API",
    description="Common API server for grievance analysis, recurrence, and severity services.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup() -> None:
    """Load artifacts required by the severity service."""
    SeverityModelLoader.load()


@app.get("/")
def health_check() -> dict[str, object]:
    return {
        "status": "running",
        "service": "eGOV Common ML API",
        "endpoints": {
            "analysis": "/analyze",
            "recurrence": "/recurrence",
            "severity": "/severity",
        },
    }


app.include_router(analyze_router)
app.include_router(recurrence_router)
app.include_router(recurrence_health_router)
app.include_router(severity_router)


if __name__ == "__main__":
    import uvicorn

    port = int(os.getenv("PORT", "8000"))
    uvicorn.run("main:app", host="0.0.0.0", port=port)
