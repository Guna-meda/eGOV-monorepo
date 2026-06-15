import joblib
import pandas as pd
from sklearn.ensemble import RandomForestRegressor

from src.utils.config import MODELS_DIR, RANDOM_SEED


def _risk_label(score: float) -> str:
    if score >= 0.78:
        return "CRITICAL"
    if score >= 0.58:
        return "HIGH"
    if score >= 0.35:
        return "MEDIUM"
    return "LOW"


def build_ward_risk(complaints: pd.DataFrame, hotspot_summary: pd.DataFrame) -> pd.DataFrame:
    hotspot_counts = complaints[complaints["hotspot_id"].astype(str) != "-1"].groupby(["admin_ulb_code", "ward_code"]).size()
    ward = (
        complaints.groupby(["admin_ulb_code", "ward_code"], dropna=False)
        .agg(
            complaint_count=("complaint_id", "count"),
            avg_severity_score=("severity_score", "mean"),
            high_severity_share=("severity_label", lambda values: values.isin(["HIGH", "CRITICAL"]).mean()),
            avg_sentiment_score=("sentiment_score", "mean"),
            escalation_rate=("has_escalation", "mean"),
            sla_breach_rate=("sla_breached", "mean"),
            unresolved_rate=("is_unresolved", "mean"),
            lat=("lat", "mean"),
            lon=("lon", "mean"),
        )
        .reset_index()
    )
    ward["hotspot_count"] = ward.set_index(["admin_ulb_code", "ward_code"]).index.map(hotspot_counts).fillna(0).astype(int)
    density_norm = ward["complaint_count"] / max(ward["complaint_count"].max(), 1)
    hotspot_norm = ward["hotspot_count"] / max(ward["hotspot_count"].max(), 1)
    ward["risk_score"] = (
        0.30 * ward["avg_severity_score"].fillna(0)
        + 0.18 * density_norm
        + 0.16 * hotspot_norm
        + 0.14 * ward["sla_breach_rate"].fillna(0)
        + 0.12 * ward["unresolved_rate"].fillna(0)
        + 0.10 * ward["escalation_rate"].fillna(0)
    ).clip(0, 1).round(3)

    features = ["complaint_count", "avg_severity_score", "high_severity_share", "escalation_rate", "sla_breach_rate", "unresolved_rate", "hotspot_count"]
    if len(ward) >= 5:
        model = RandomForestRegressor(n_estimators=120, random_state=RANDOM_SEED, min_samples_leaf=2)
        model.fit(ward[features].fillna(0), ward["risk_score"])
        model_dir = MODELS_DIR / "risk_model"
        model_dir.mkdir(parents=True, exist_ok=True)
        joblib.dump(model, model_dir / "ward_risk_random_forest.joblib")
        ward["ml_risk_score"] = model.predict(ward[features].fillna(0)).clip(0, 1).round(3)
    else:
        ward["ml_risk_score"] = ward["risk_score"]

    ward["risk_label"] = ward["ml_risk_score"].map(_risk_label)
    ward["recommended_action"] = ward["risk_label"].map(
        {
            "CRITICAL": "Immediate inspection and preventive deployment",
            "HIGH": "Department alert and field verification within 24h",
            "MEDIUM": "Monitor trend and prepare ward-level mitigation",
            "LOW": "Routine monitoring",
        }
    )
    return ward.sort_values("ml_risk_score", ascending=False)
