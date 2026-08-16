# eGOV Monorepo

Grievance/complaint management system: citizens submit complaints, the system geocodes and classifies them, and staff track resolution.

## Services

| Service | Language | What it does |
|---|---|---|
| `complaint-service` | Node/TS | Complaint CRUD API, backed by Postgres via `packages/shared` (Drizzle) |
| `gis-service` | Node/TS | Geospatial lookups (wards, boundaries) for complaints |
| `frontend` | Node/TS | Citizen + staff web UI (Vite) |
| `packages/shared` | Node/TS | Shared types, DB schema, and Drizzle migrations used by the Node services |
| `classification-service` | Python/FastAPI | Predicts a complaint's service category, menu path, and urgency from its text |
| `recurrence-service` | Python/FastAPI | Detects whether an incoming complaint is a recurrence of a past one |
| `ingestion-service` | Python/FastAPI | Scaffold for the Kafka consumer + AI enrichment pipeline (not yet implemented) |

## Folder structure

```
eGOV-Monorepo/
├── complaint-service/       # Node API — complaints
├── gis-service/             # Node API — geospatial
├── frontend/                # Node — web UI
├── packages/shared/         # Node — shared types, DB schema, Drizzle migrations
├── classification-service/  # Python — category/urgency classification
├── recurrence-service/      # Python — recurrence detection
├── ingestion-service/       # Python — Kafka consumer + AI enrichment (stub)
└── docker-compose.yml       # Runs the whole stack
```

Each Node service is an npm workspace (see the root `package.json`). Each Python
service is independent — same internal shape (`app/`, `tests/`, `Dockerfile`,
`requirements.txt`, `requirements-dev.txt`, `.env.example`, `README.md`), own
container, own port. There is no combined Python entrypoint — every service
runs as its own process/container.

## Running the stack locally

```powershell
docker compose up
```

This starts, in order: Postgres → DB migration → `complaint-service`,
`gis-service`, `recurrence-service`, `classification-service`,
`ingestion-service` → `frontend`.

| Service | Port |
|---|---|
| frontend | 5173 |
| complaint-service | 5001 |
| gis-service | 3000 |
| postgres | 5432 |
| recurrence-service | 8000 |
| classification-service | 8001 |
| ingestion-service | 8002 |

To work on a single Python service without Docker, `cd` into it and follow its
own `README.md`.

## Where Kafka / AI enrichment fit in (planned)

Not implemented yet — `ingestion-service` is currently a structural stub. The
intended shape:

1. `complaint-service` publishes a complaint-created event to a Kafka topic.
2. `ingestion-service` consumes that topic, calls `classification-service` and
   `recurrence-service` to enrich the complaint (category, urgency, recurrence
   signal, etc.).
3. The enriched result is written to an `ai_enrichment` table (not yet
   defined in `packages/shared`'s schema), keyed by complaint ID, for the
   Node services and frontend to read.

This pass only sets up `ingestion-service`'s folder structure — the consumer
and enrichment logic land in a follow-up.
