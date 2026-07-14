"""Client abstraction for future Analytics API integrations."""

from __future__ import annotations

from typing import Any

import requests


class AnalyticsClient:
    """Minimal client wrapper for fetching complaint data from an external API."""

    def __init__(self, base_url: str | None = None, timeout: int = 10) -> None:
        """Initialize the client with a base URL and request timeout."""
        self.base_url = base_url or ""
        self.timeout = timeout

    def fetch_data(self, endpoint: str, params: dict[str, Any] | None = None) -> dict[str, Any]:
        """Fetch JSON data from the configured Analytics API endpoint."""
        if not self.base_url:
            raise ValueError("Analytics base URL is not configured")

        response = requests.get(f"{self.base_url.rstrip('/')}/{endpoint.lstrip('/')}", params=params, timeout=self.timeout)
        response.raise_for_status()
        return response.json()
