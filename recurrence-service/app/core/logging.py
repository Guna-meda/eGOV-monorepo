"""Logging configuration helpers for the recurrence service."""

from __future__ import annotations

import logging
import sys

from app.core.config import settings


def configure_logging() -> None:
    """Configure application logging for console output."""
    logging.basicConfig(
        level=getattr(logging, settings.LOG_LEVEL.upper(), logging.INFO),
        format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
        handlers=[logging.StreamHandler(sys.stdout)],
        force=True,
    )
