import pandas as pd

DANGER_CATEGORIES = { "water",
    "garbage",
    "overflow",
    "drain",
    "blocked",
    "sewage",
    "road",
    "damaged",
    "pothole",
    "electricity",
    "streetlight",
    "fire",
    "flood",
    "broken",
    "leakage"}


def _label(score: float) -> str:
    if score >= 0.8:
        return "CRITICAL"
    if score >= 0.6:
        return "HIGH"
    if score >= 0.35:
        return "MEDIUM"
    return "LOW"


def add_severity(df: pd.DataFrame, workflow_features: pd.DataFrame) -> pd.DataFrame:
    enriched = df.merge(workflow_features, on="complaint_id", how="left")
    for column in ["has_escalation", "is_unresolved", "sla_breached", "reopened", "resolution_hours"]:
        enriched[column] = enriched[column].fillna(0)

    category_weight = enriched["category"].isin(DANGER_CATEGORIES).astype(float) * 0.16
    density = (enriched["category_geohash_density"].fillna(0) / enriched["category_geohash_density"].fillna(0).max()).fillna(0)
    unresolved_age = (enriched["resolution_hours"].fillna(0) / 120).clip(0, 1)

    enriched["severity_score"] = (
        0.18
        + category_weight
        + 0.22 * enriched["urgency_score"].fillna(0)
        + 0.15 * density
        + 0.12 * enriched["has_escalation"].astype(float)
        + 0.13 * enriched["sla_breached"].astype(float)
        + 0.08 * enriched["is_unresolved"].astype(float)
        + 0.05 * unresolved_age
    ).clip(0, 1).round(3)
    enriched["severity_label"] = enriched["severity_score"].map(_label)
    return enriched
