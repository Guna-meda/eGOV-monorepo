"""
Simulates real-time complaint arrival -- publishes one complaint at a time,
with a delay between each, instead of batch-pushing everything at once.

This exists purely because we don't have a real CCRS instance to listen to
yet. Once real CCRS integration happens, our consumer would instead
subscribe directly to CCRS's own live complaint-created topic -- this script
is a stand-in for that, using the exact same topic/message shape as
producer.py (the batch one), so the consumer needs zero changes either way.

Run:
    python realtime_simulator.py --interval 5

Reads DATABASE_URL from the environment, same as the other scripts. Uses a
SEPARATE checkpoint file from producer.py, so running the batch producer and
this simulator won't step on each other's "already sent" tracking.
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

from producer import build_message, TOPIC  # reuse the exact same message shape

CHECKPOINT_FILE = Path(__file__).parent / ".realtime_checkpoint"


def load_checkpoint() -> int:
    if CHECKPOINT_FILE.exists():
        return int(CHECKPOINT_FILE.read_text().strip() or 0)
    return 0


def save_checkpoint(createdtime: int) -> None:
    CHECKPOINT_FILE.write_text(str(createdtime))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--interval", type=float, default=5.0,
                     help="seconds to wait between each simulated complaint (default 5)")
    ap.add_argument("--limit", type=int, default=None,
                     help="stop after this many messages (omit = run until data runs out)")
    ap.add_argument("--topic", default=TOPIC)
    ap.add_argument("--bootstrap-servers", default="localhost:29092")
    ap.add_argument("--reset-checkpoint", action="store_true")
    args = ap.parse_args()

    database_url = os.environ.get("DATABASE_URL")
    if not database_url:
        print("ERROR: DATABASE_URL is not set.")
        sys.exit(1)

    since = 0 if args.reset_checkpoint else load_checkpoint()
    print(f"Simulating real-time arrivals, one every {args.interval}s, starting from createdtime > {since}")

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
    cur.close()
    conn.close()

    print(f"Rows queued to trickle out: {len(rows)}")
    if not rows:
        print("Nothing to publish.")
        return

    producer = KafkaProducer(
        bootstrap_servers=args.bootstrap_servers,
        key_serializer=lambda k: k.encode("utf-8"),
        value_serializer=lambda v: json.dumps(v).encode("utf-8"),
    )

    try:
        for i, row in enumerate(rows, start=1):
            message = build_message(row)
            producer.send(args.topic, key=row["servicerequestid"], value=message)
            producer.flush()
            print(f"[{i}/{len(rows)}] published {row['servicerequestid']} ({row['servicecode']})")
            save_checkpoint(row["createdtime"])
            if i < len(rows):
                time.sleep(args.interval)
    except KeyboardInterrupt:
        print("\nStopped early -- checkpoint saved, resume anytime by rerunning.")
    finally:
        producer.close()

    print("Done.")


if __name__ == "__main__":
    main()