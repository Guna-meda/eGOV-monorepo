# recurrence-service

This service provides a standalone FastAPI-based ingestion and recurrence analysis workflow for complaint data.

## Data ingestion

The ingestion layer loads CSV datasets from the raw data directory using a reusable DataLoader abstraction.
