import json
from pathlib import Path
from typing import Any


PROJECT_ROOT = Path(__file__).resolve().parents[2]

RAINMAKER_PATHS = [
    PROJECT_ROOT / "data" / "rainmaker.json",
    PROJECT_ROOT / "data" / "RAINMAKER-PGR.ServiceDefs.json",
]


def _resolve_rainmaker_path() -> Path:
    for path in RAINMAKER_PATHS:
        if path.exists():
            return path
    searched = ", ".join(str(path) for path in RAINMAKER_PATHS)
    raise FileNotFoundError(f"Rainmaker service definition JSON not found. Searched: {searched}")


def _extract_services(payload: Any) -> list[dict[str, Any]]:
    if isinstance(payload, list):
        return payload

    if not isinstance(payload, dict):
        raise ValueError("Rainmaker service definition JSON must be a list or object.")

    for key in ("ServiceDefs", "serviceDefs", "services"):
        value = payload.get(key)
        if isinstance(value, list):
            return value

    for value in payload.values():
        if isinstance(value, list) and all(isinstance(item, dict) for item in value):
            return value

    raise ValueError("Could not find service definitions in Rainmaker JSON.")


def load_services() -> list[dict[str, Any]]:
    with _resolve_rainmaker_path().open(encoding="utf-8") as f:
        payload = json.load(f)

    services = []
    for item in _extract_services(payload):
        service_code = item.get("serviceCode")
        if service_code and item.get("active", True):
            services.append(item)

    return services


services = load_services()
service_lookup = {item["serviceCode"]: item for item in services}
