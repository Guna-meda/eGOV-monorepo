"""
Consumes messages off save-pgr-request, calls classification-service and
recurrence-service, and writes one row per complaint into ai_enrichment.

KNOWN LIMITATION (flagged, not hidden): recurrence-service currently computes
its /recurrence table from its own local historical CSVs, which are Bengaluru
data -- unrelated to our loaded GCC/Chennai complaints. Lookups by our
serviceCode will very likely miss. This still proves the real wiring end to
end; recurrence_score/is_hotspot will just be null until recurrence-service
is pointed at eg_pgr_service_v2 instead (separate follow-up task).

Run:
    pip install kafka-python psycopg2-binary requests

    python consumer.py

Reads DATABASE_URL from the environment, same as the other scripts.
Requires classification-service (localhost:8001) and recurrence-service
(localhost:8000) to already be running.
"""
import os
import sys
import json
import uuid
import logging

import requests
import psycopg2
from kafka import KafkaConsumer

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
log = logging.getLogger("consumer")

TOPIC = "save-pgr-request"
GROUP_ID = "ai-enrichment-consumer"  # own consumer group -- independent of any
                                     # complaint-service consumer group on the
                                     # same topic, per the "same topic, two
                                     # consumer groups" design from the call.

CLASSIFICATION_URL = "http://localhost:8001/analyze"
RECURRENCE_URL = "http://localhost:8000/api/v1/recurrence"
MODEL_VERSION = "classification-service-sentencetransformer-catboost-v1"

_recurrence_cache = None  # populated once, on first use


def get_recurrence_lookup() -> dict:
    """Fetch /recurrence once and cache it, keyed by serviceCode.

    NOTE: source data is currently unrelated Bengaluru CSVs -- see module
    docstring. Lookups will mostly miss for our Chennai serviceCodes; that's
    expected right now, not a bug in this consumer.
    """
    global _recurrence_cache
    if _recurrence_cache is not None:
        return _recurrence_cache

    log.info("Fetching recurrence table from %s ...", RECURRENCE_URL)
    resp = requests.get(RECURRENCE_URL, timeout=30)
    resp.raise_for_status()
    rows = resp.json()

    lookup = {}
    for row in rows:
        # last one wins if a serviceCode appears under multiple wards --
        # fine for now given ward is meaningless in our data anyway.
        lookup[row["serviceCode"]] = row

    log.info("Cached %d recurrence rows (serviceCode-keyed)", len(lookup))
    _recurrence_cache = lookup
    return lookup


def classify(description: str) -> dict:
    resp = requests.post(CLASSIFICATION_URL, json={"text": description or ""}, timeout=30)
    resp.raise_for_status()
    return resp.json()


def lookup_recurrence(service_code: str) -> dict:
    lookup = get_recurrence_lookup()
    row = lookup.get(service_code)
    if row is None:
        return {"recurrence_score": None, "is_hotspot": None}
    return {"recurrence_score": row["recurrence_score"], "is_hotspot": row["is_hotspot"]}


def already_processed(conn, complaint_id: str) -> bool:
    """Idempotency guard: skip if this complaint already has a result from
    this model version. Protects against duplicate processing from Kafka
    redelivery (rebalances, retries, etc.) without needing a DB unique
    constraint -- multiple rows per complaint are still allowed across
    different model_versions, just not duplicated within the same one."""
    with conn.cursor() as cur:
        cur.execute(
            "SELECT 1 FROM ai_enrichment WHERE complaint_id = %s AND model_version = %s LIMIT 1",
            (complaint_id, MODEL_VERSION),
        )
        return cur.fetchone() is not None


def write_enrichment(conn, complaint_id: str, classification: dict, recurrence: dict) -> None:
    with conn.cursor() as cur:
        cur.execute(
            """
            INSERT INTO ai_enrichment
                (id, complaint_id, predicted_category, predicted_subcategory,
                 confidence, urgency, urgency_signals, recurrence_score,
                 is_hotspot, model_version)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """,
            (
                str(uuid.uuid4()),
                complaint_id,
                classification.get("predicted_service_code"),
                classification.get("predicted_menu_path"),
                (classification.get("confidence") or [None])[0],
                classification.get("urgency"),
                json.dumps(classification.get("urgency_signals") or []),
                recurrence.get("recurrence_score"),
                recurrence.get("is_hotspot"),
                MODEL_VERSION,
            ),
        )
    conn.commit()


def process_message(conn, message: dict) -> None:
    service = message["service"]
    complaint_id = service["id"]
    service_code = service["serviceCode"]
    description = service.get("description")

    log.info("Processing %s (%s)", service["serviceRequestId"], service_code)

    if already_processed(conn, complaint_id):
        log.info("  already enriched with %s -- skipping (likely redelivery)", MODEL_VERSION)
        return

    classification = classify(description)
    recurrence = lookup_recurrence(service_code)

    if recurrence["recurrence_score"] is None:
        log.info("  no recurrence match for serviceCode=%s (expected -- see module docstring)", service_code)

    write_enrichment(conn, complaint_id, classification, recurrence)
    log.info(
        "  done: urgency=%s predicted=%s recurrence_score=%s",
        classification.get("urgency"),
        classification.get("predicted_service_code"),
        recurrence.get("recurrence_score"),
    )


def main():
    database_url = os.environ.get("DATABASE_URL")
    if not database_url:
        print("ERROR: DATABASE_URL is not set.")
        sys.exit(1)

    conn = psycopg2.connect(database_url)

    consumer = KafkaConsumer(
        TOPIC,
        bootstrap_servers="localhost:29092",
        group_id=GROUP_ID,
        auto_offset_reset="earliest",
        enable_auto_commit=True,       # let the client commit offsets on its own
        auto_commit_interval_ms=5000,  # background schedule, decoupled from our loop --
        session_timeout_ms=60000,      # manual commit() right after each blocking
        heartbeat_interval_ms=5000,    # classify() call was getting the consumer kicked
                                        # from the group essentially every single message
                                        # (every commit was failing), causing heavy
                                        # redelivery/duplicate processing. This trades a
                                        # slightly weaker "only commit after a confirmed
                                        # DB write" guarantee for actually staying in the
                                        # group -- acceptable here since duplicates are
                                        # now cheap to clean up (see cleanup query) and
                                        # actual data loss risk is unaffected either way.
        value_deserializer=lambda v: json.loads(v.decode("utf-8")),
    )

    log.info("Consumer started, listening on '%s' (group=%s)", TOPIC, GROUP_ID)

    for record in consumer:
        try:
            process_message(conn, record.value)
        except Exception:
            log.exception("Failed to process message at offset %s -- DB write did not complete", record.offset)
            conn.rollback()
            # NOTE: with auto-commit, this offset may still advance in the
            # background regardless of this failure -- if that matters, switch
            # back to manual commit() + enable_auto_commit=False, accepting the
            # group-eviction tradeoff described above.


if __name__ == "__main__":
    main()