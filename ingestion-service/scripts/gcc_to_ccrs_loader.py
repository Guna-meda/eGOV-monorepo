"""
GCC Excel export -> eg_pgr_service_v2 / eg_pgr_address_v2 (this repo's own
Postgres, via the tables added in packages/shared/src/db/schema/).

Reuses the same categorization logic from the CCRS-repo loader (same
CATEGORY_RULES, same normalize/to_service_code functions) since there's no
MDMS here to fetch service codes from -- this repo derives serviceCode
directly instead of loading it into a config service first.

Run:
    pip install psycopg2-binary pandas openpyxl
    python gcc_to_ccrs_loader.py <path-to-gcc-excel.xlsx>

Reads DATABASE_URL from the environment (same variable used by
packages/shared's drizzle.config.ts), e.g.:
    postgresql://grievance:grievance@localhost:5432/grievance_db
"""
import os
import re
import sys
import uuid
import time
import argparse
from collections import Counter

import pandas as pd
import psycopg2
import psycopg2.extras

TENANT_ID = "pg.chennai"  # arbitrary but fixed -- no MDMS/tenant registry in this repo
DESCRIPTION_MAX_LEN = 4000  # eg_pgr_service_v2.description is varchar(4000)
BATCH_SIZE = 2000

FY_START = pd.Timestamp("2024-04-01")
FY_END = pd.Timestamp("2025-03-31 23:59:59")

STOPWORDS = {
    "complaint", "complaints", "regarding", "related", "to", "of", "in",
    "on", "at", "for", "and", "or", "the", "a", "an", "not", "no",
    "is", "are", "be", "with", "any", "other", "provided", "issues",
    "issue",
}

LOCATION_SUFFIX_RE = re.compile(r"\([A-Za-z].*(Road|Metro|MMI)\)\s*$")

CATEGORY_RULES = [
    ("Garbage", ["garbage", "dustbin", "bin", "sweeping", "sweeper", "litter",
                 "biomedical waste", "transfer station", "plastic", "dumping"]),
    ("StreetLights", ["street light", "streetlight", "electric pole", "eb cable",
                       "electricity shock", "electricity unavailability",
                       "dark spot", "no lights", "non functional lights",
                       "inadequate light"]),
    ("Drainage", ["drain", "sewage", "sewerage", "sewarage", "desilt", "manhole",
                  "water flow", "stagnation of water", "water table", "silt"]),
    ("WaterSupply", ["water supply", "drinking water"]),
    ("Sanitation", ["toilet", "urinal", "defecation", "slaughter", "meat",
                     "livestock", "unhygenic", "unhygienic", "hotels",
                     "restaurant", "food"]),
    ("PublicHealth", ["mosquito", "dengue", "malaria", "gastro", "health",
                       "ambulance", "hospital", "doctor", "medicine",
                       "maternity", "nutrition", "jsy", "mrmbs", "stray",
                       "dogs", "cattle", "pigs", "air quality", "cdh",
                       "laboratory", "baby care"]),
    ("BuildingSafety", ["building plan", "unauthorized", "unauthorised",
                         "illegal construction", "dcr", "building by law",
                         "advertisement board", "fallen pole", "hoarding",
                         "overhead cable", "encroach"]),
    ("Markets", ["shopping complex", "trade licence", "trade license",
                 "market", "eateries", "eatery"]),
    ("Roads", ["road", "footpath", "foot path", "pothole", "pot hole",
               "milling", "relaying", "pathway ramp", "barricad",
               "encroaching public space", "bridge", "flyover", "subway",
               "traffic island", "centre median", "parking", "debris",
               "quality of work", "progress of work"]),
]


def normalize(name: str) -> str:
    if not isinstance(name, str):
        return ""
    name = name.replace("\xa0", " ")
    return re.sub(r"\s+", " ", name).strip()


def to_service_code(name: str) -> str:
    tokens = re.findall(r"[A-Za-z0-9]+", name)
    return "".join(t[:1].upper() + t[1:].lower() for t in tokens if t)


def to_menu_path(name: str) -> str:
    if LOCATION_SUFFIX_RE.search(name):
        return "Roads"
    lower = name.lower()
    for menu_path, keywords in CATEGORY_RULES:
        for kw in keywords:
            if kw in lower:
                return menu_path
    return "General"


def to_millis(dt) -> int | None:
    ts = pd.to_datetime(dt, errors="coerce")
    if pd.isna(ts):
        return None
    return int(ts.timestamp() * 1000)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("excel_path")
    ap.add_argument("--tenant", default=TENANT_ID)
    ap.add_argument("--skip-fy-filter", action="store_true")
    args = ap.parse_args()

    database_url = os.environ.get("DATABASE_URL")
    if not database_url:
        print("ERROR: DATABASE_URL is not set.")
        sys.exit(1)

    print(f"Reading {args.excel_path} ...")
    df = pd.read_excel(args.excel_path)
    print(f"Total rows: {len(df)}")

    required_cols = {"COMPLAINTNUMBER", "COMPLAINTDETAILS", "COMPLAINTTYPENAME", "COMPLAINTDATE"}
    missing = required_cols - set(df.columns)
    if missing:
        print(f"ERROR: missing columns: {missing}")
        sys.exit(1)

    if not args.skip_fy_filter:
        dates = pd.to_datetime(df["COMPLAINTDATE"], errors="coerce")
        in_fy = dates.between(FY_START, FY_END)
        dropped = (~in_fy).sum()
        if dropped:
            print(f"FY2024-25 filter: dropping {dropped} rows")
        df = df[in_fy].reset_index(drop=True)
        print(f"Rows after FY filter: {len(df)}")

    # Build a stable serviceCode per unique complaint type up front, so the
    # same complaint type always maps to the same code within this run.
    unique_types = sorted({normalize(t) for t in df["COMPLAINTTYPENAME"].dropna().unique()})
    code_map = {}
    seen_codes = {}
    for name in unique_types:
        code = to_service_code(name)
        if code in seen_codes:
            raise ValueError(f"serviceCode collision: '{code}' from '{seen_codes[code]}' and '{name}'")
        seen_codes[code] = name
        code_map[name] = code
    print(f"Derived {len(code_map)} distinct serviceCodes across {len(CATEGORY_RULES) + 1} categories")

    conn = psycopg2.connect(database_url)
    conn.autocommit = False
    cur = conn.cursor()

    now_ms = int(time.time() * 1000)
    service_rows, address_rows = [], []
    bad_dates = 0

    for row in df.itertuples(index=False):
        complaint_type = normalize(getattr(row, "COMPLAINTTYPENAME"))
        service_code = code_map.get(complaint_type)
        if not service_code:
            continue

        created_ms = to_millis(getattr(row, "COMPLAINTDATE"))
        if created_ms is None:
            bad_dates += 1
            continue

        row_id = str(uuid.uuid4())
        complaint_number = getattr(row, "COMPLAINTNUMBER")
        description = getattr(row, "COMPLAINTDETAILS")
        if isinstance(description, str) and len(description) > DESCRIPTION_MAX_LEN:
            description = description[:DESCRIPTION_MAX_LEN]
        elif not isinstance(description, str):
            description = None

        service_rows.append((
            row_id, args.tenant, service_code, f"GCC-{complaint_number}",
            description, None, None, "CLOSED", None, "gcc_import",
            "gcc_migration_user", created_ms, None, None, True,
        ))
        address_rows.append((
            row_id, args.tenant, row_id, "UNKNOWN", "gcc_migration_user", created_ms,
        ))

    print(f"\nRows ready to insert: {len(service_rows)}")
    if bad_dates:
        print(f"Skipped {bad_dates} rows: unparseable COMPLAINTDATE")

    service_sql = """
        INSERT INTO eg_pgr_service_v2
            (id, tenantid, servicecode, servicerequestid, description, accountid,
             additionaldetails, applicationstatus, rating, source, createdby,
             createdtime, lastmodifiedby, lastmodifiedtime, active)
        VALUES %s
        ON CONFLICT (tenantid, servicerequestid) DO NOTHING
    """
    address_sql = """
        INSERT INTO eg_pgr_address_v2
            (id, tenantid, parentid, locality, createdby, createdtime)
        VALUES %s
        ON CONFLICT (id) DO NOTHING
    """

    inserted = 0
    for i in range(0, len(service_rows), BATCH_SIZE):
        batch = service_rows[i:i + BATCH_SIZE]
        psycopg2.extras.execute_values(cur, service_sql, batch)
        psycopg2.extras.execute_values(cur, address_sql, address_rows[i:i + BATCH_SIZE])
        conn.commit()
        inserted += len(batch)
        print(f"  committed {inserted}/{len(service_rows)}")

    cur.close()
    conn.close()
    print(f"\nDone. Attempted insert of {len(service_rows)} complaints (tenant={args.tenant}).")


if __name__ == "__main__":
    main()