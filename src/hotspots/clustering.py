import numpy as np
import pandas as pd
from sklearn.cluster import DBSCAN


def detect_hotspots(df: pd.DataFrame, eps_km: float = 1.5, min_samples: int = 4) -> tuple[pd.DataFrame, pd.DataFrame]:
    enriched = df.copy()
    enriched["hotspot_id"] = "-1"
    earth_radius_km = 6371.0088
    eps_radians = eps_km / earth_radius_km

    for category, group in enriched[enriched["has_valid_location"].fillna(False)].groupby("category"):
        if len(group) < min_samples:
            continue
        coords = np.radians(group[["lat", "lon"]].to_numpy(dtype=float))
        labels = DBSCAN(eps=eps_radians, min_samples=min_samples, metric="haversine").fit_predict(coords)
        enriched.loc[group.index, "hotspot_id"] = [f"{category}_{label}" if label >= 0 else "-1" for label in labels]

    clustered = enriched[enriched["hotspot_id"].astype(str) != "-1"].copy()
    if clustered.empty:
        return enriched, pd.DataFrame(columns=["hotspot_id", "category", "complaint_count", "center_lat", "center_lon", "avg_severity_score"])

    summary = (
        clustered.groupby(["hotspot_id", "category"])
        .agg(
            complaint_count=("complaint_id", "count"),
            center_lat=("lat", "mean"),
            center_lon=("lon", "mean"),
            avg_sentiment_score=("sentiment_score", "mean"),
            avg_urgency_score=("urgency_score", "mean"),
            ulbs=("admin_ulb_code", lambda values: ",".join(sorted(set(values.dropna().astype(str))))),
            wards=("ward_code", lambda values: ",".join(sorted(set(values.dropna().astype(str))))),
        )
        .reset_index()
    )
    return enriched, summary
