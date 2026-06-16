import pandas as pd


def clean_geo(geo: pd.DataFrame) -> pd.DataFrame:
    cleaned = geo.copy()
    cleaned["lat"] = pd.to_numeric(cleaned["lat"], errors="coerce")
    cleaned["lon"] = pd.to_numeric(cleaned["lon"], errors="coerce")
    cleaned["accuracy_m"] = pd.to_numeric(cleaned["accuracy_m"], errors="coerce")
    cleaned["has_valid_location"] = cleaned["lat"].between(18, 22) & cleaned["lon"].between(72, 81)
    cleaned["ward_code"] = cleaned["ward_code"].fillna("UNKNOWN")
    cleaned["geohash6"] = cleaned["geohash6"].fillna("UNKNOWN")
    return cleaned


def add_geo_features(complaints: pd.DataFrame, geo: pd.DataFrame) -> pd.DataFrame:
    geo_primary = clean_geo(geo)
    geo_primary = geo_primary[geo_primary["is_primary"].astype(str).str.lower().eq("true")].drop_duplicates("complaint_id")
    merged = complaints.merge(geo_primary, on="complaint_id", how="left")
    ward_counts = merged.groupby(["admin_ulb_code", "ward_code"], dropna=False)["complaint_id"].transform("count")
    geohash_counts = merged.groupby(["geohash6", "category"], dropna=False)["complaint_id"].transform("count")
    merged["ward_complaint_density"] = ward_counts.fillna(0).astype(int)
    merged["category_geohash_density"] = geohash_counts.fillna(0).astype(int)
    return merged
