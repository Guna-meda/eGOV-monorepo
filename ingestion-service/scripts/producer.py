"""
Reads rows from eg_pgr_service_v2 (joined with eg_pgr_address_v2) and
publishes them onto the save-pgr-request Kafka topic, shaped exactly like
the real CCRS/DIGIT PGR message: {RequestInfo, service, workflow}.

This simulates what would really happen when a citizen files a complaint on
live CCRS -- our consumer doesn't need to know or care whether a message
came from this producer (batch, our own DB) or the real CCRS topic later.

Run:
    pip install kafka-python psycopg2-binary

    # push exactly 1 message -- use this for the Tuesday "one record" checkpoint
    python producer.py --limit 1

    # push everything not yet processed (tracked via checkpoint file)
    python producer.py

Reads DATABASE_URL from the environment, same as gcc_to_ccrs_loader.py.
"""
import os
import sys
import json
import time
import argparse
from pathlib import Path

import psycopg2
import psycopg2.extras
from kafka import KafkaProducer

CHECKPOINT_FILE = Path(__file__).parent / ".producer_checkpoint"
TOPIC = "save-pgr-request"


def load_checkpoint() -> int:
    """Last createdtime (epoch millis) already pushed. 0 means 'start from the beginning'."""
    if CHECKPOINT_FILE.exists():
        return int(CHECKPOINT_FILE.read_text().strip() or 0)
    return 0


def save_checkpoint(createdtime: int) -> None:
    CHECKPOINT_FILE.write_text(str(createdtime))


def build_message(row: dict) -> dict:
    """Shape one DB row into the real {RequestInfo, service, workflow} payload."""
    now_ms = int(time.time() * 1000)

    return {
        "RequestInfo": {
            "apiId": "org.egov.pgr",
            "ver": "1.0",
            "ts": now_ms,
            "action": "_create",
            "did": None,
            "key": None,
            "msgId": f"{row['servicerequestid']}|en_IN",
            "authToken": None,
            "userInfo": None,
        },
        "service": {
            "id": row["id"],
            "tenantId": row["tenantid"],
            "serviceCode": row["servicecode"],
            "serviceRequestId": row["servicerequestid"],
            "description": row["description"],
            "accountId": row["accountid"],
            "additionalDetail": row["additionaldetails"],
            "applicationStatus": row["applicationstatus"],
            "source": row["source"],
            "address": {
                "locality": row.get("locality"),
                "geoLocation": {
                    "latitude": row.get("latitude"),
                    "longitude": row.get("longitude"),
                },
            },
            "documents": [],
            "auditDetails": {
                "createdBy": row["createdby"],
                "createdTime": row["createdtime"],
                "lastModifiedBy": row["lastmodifiedby"],
                "lastModifiedTime": row["lastmodifiedtime"],
            },
            # complainantAddress and email deliberately omitted -- the real
            # system strips these before publishing (see team confirmation).
            # extendedAttributes deliberately omitted -- not needed for
            # classification/urgency/recurrence, and the real message has it
            # encrypted, which we can't reproduce meaningfully here.
        },
        "workflow": {
            "action": "APPLY",
            "businessService": "PGR",
            "moduleName": "PGR",
        },
    }


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--limit", type=int, default=None,
                     help="max number of complaints to push (omit = push everything not yet processed)")
    ap.add_argument("--topic", default=TOPIC)
    ap.add_argument("--bootstrap-servers", default="localhost:29092")
    ap.add_argument("--reset-checkpoint", action="store_true",
                     help="ignore the checkpoint file and start from the very beginning")
    args = ap.parse_args()

    database_url = os.environ.get("DATABASE_URL")
    if not database_url:
        print("ERROR: DATABASE_URL is not set.")
        sys.exit(1)

    since = 0 if args.reset_checkpoint else load_checkpoint()
    print(f"Starting from createdtime > {since}")

    conn = psycopg2.connect(database_url)
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

    query = """
        SELECT s.id, s.tenantid, s.servicecode, s.servicerequestid, s.description,
               s.accountid, s.additionaldetails, s.applicationstatus, s.source,
               s.createdby, s.createdtime, s.lastmodifiedby, s.lastmodifiedtime,
               a.locality, a.latitude, a.longitude
        FROM eg_pgr_service_v2 s
        LEFT JOIN eg_pgr_address_v2 a ON a.parentid = s.id
        WHERE s.createdtime > %s
        ORDER BY s.createdtime
    """
    if args.limit:
        query += " LIMIT %s"
        cur.execute(query, (since, args.limit))
    else:
        cur.execute(query, (since,))

    rows = cur.fetchall()
    print(f"Rows to publish: {len(rows)}")

    if not rows:
        print("Nothing to publish.")
        return

    producer = KafkaProducer(
        bootstrap_servers=args.bootstrap_servers,
        key_serializer=lambda k: k.encode("utf-8"),
        value_serializer=lambda v: json.dumps(v).encode("utf-8"),
    )

    last_createdtime = since
    for i, row in enumerate(rows, start=1):
        message = build_message(row)
        producer.send(args.topic, key=row["servicerequestid"], value=message)
        last_createdtime = row["createdtime"]
        if i % 500 == 0 or i == len(rows):
            print(f"  queued {i}/{len(rows)}")

    producer.flush()
    producer.close()
    cur.close()
    conn.close()

    save_checkpoint(last_createdtime)
    print(f"\nDone. Published {len(rows)} messages to '{args.topic}'.")
    print(f"Checkpoint saved at createdtime={last_createdtime} -- next run without --limit continues from here.")


if __name__ == "__main__":
    main()