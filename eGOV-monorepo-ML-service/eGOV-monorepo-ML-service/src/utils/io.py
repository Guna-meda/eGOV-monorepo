import pandas as pd

from src.utils.config import (
    DATA_PROCESSED_DIR,
    EVIDENCE_PATH,
    GEO_PATH,
    INTAKE_PATH,
    MAPS_DIR,
    OUTPUTS_DIR,
    TEXT_ASR_PATH,
    WORKFLOW_PATH,
)


def ensure_dirs() -> None:
    DATA_PROCESSED_DIR.mkdir(parents=True, exist_ok=True)
    OUTPUTS_DIR.mkdir(parents=True, exist_ok=True)
    MAPS_DIR.mkdir(parents=True, exist_ok=True)


def load_raw_tables() -> dict[str, pd.DataFrame]:
    return {
        "intake": pd.read_csv(INTAKE_PATH),
        "text_asr": pd.read_csv(TEXT_ASR_PATH),
        "geo": pd.read_csv(GEO_PATH),
        "workflow": pd.read_csv(WORKFLOW_PATH),
        "evidence": pd.read_csv(EVIDENCE_PATH),
    }


def write_csv(df: pd.DataFrame, path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    df.to_csv(path, index=False)
