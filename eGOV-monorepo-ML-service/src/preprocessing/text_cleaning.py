import re
import unicodedata

import pandas as pd


SPACE_RE = re.compile(r"\s+")
KEEP_RE = re.compile(r"[^a-z0-9\s.,;:!?/-]")


def normalize_text(value: object) -> str:
    text = "" if pd.isna(value) else str(value)
    text = unicodedata.normalize("NFKC", text).lower()
    text = KEEP_RE.sub(" ", text)
    return SPACE_RE.sub(" ", text).strip()


def build_text_frame(intake: pd.DataFrame, text_asr: pd.DataFrame) -> pd.DataFrame:
    primary = text_asr[text_asr["is_primary"].astype(str).str.lower().eq("true")].copy()
    if primary.empty:
        primary = text_asr.copy()
    primary = primary.sort_values(["complaint_id", "asr_attempt_id"]).drop_duplicates("complaint_id")
    merged = intake.merge(primary, on="complaint_id", how="left")
    merged["processed_text"] = merged["text_raw"].map(normalize_text)
    merged["text_length"] = merged["processed_text"].str.len().fillna(0).astype(int)
    merged["token_count"] = merged["processed_text"].str.split().map(lambda tokens: len(tokens) if isinstance(tokens, list) else 0)
    return merged
