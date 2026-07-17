"""Application configuration settings for the recurrence service."""

from __future__ import annotations

import os
from pathlib import Path
from typing import Final


class Settings:
    """Load runtime settings from environment variables with sensible defaults."""

    PROJECT_ROOT: Final[Path] = Path(__file__).resolve().parents[2]
    RAW_DATA_DIR: Final[Path] = PROJECT_ROOT / "data" / "raw"
    APP_ENV: Final[str] = os.getenv("APP_ENV", "development")
    LOG_LEVEL: Final[str] = os.getenv("LOG_LEVEL", "info")
    DEBUG: Final[bool] = os.getenv("DEBUG", "false").lower() in {"1", "true", "yes", "on"}


settings = Settings()
