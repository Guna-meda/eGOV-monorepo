"""Application configuration settings for the ingestion service."""

from __future__ import annotations

import os
from typing import Final


class Settings:
    """Load runtime settings from environment variables with sensible defaults."""

    APP_ENV: Final[str] = os.getenv("APP_ENV", "development")
    LOG_LEVEL: Final[str] = os.getenv("LOG_LEVEL", "info")
    KAFKA_BOOTSTRAP_SERVERS: Final[str] = os.getenv("KAFKA_BOOTSTRAP_SERVERS", "localhost:9092")
    KAFKA_TOPIC: Final[str] = os.getenv("KAFKA_TOPIC", "")


settings = Settings()
