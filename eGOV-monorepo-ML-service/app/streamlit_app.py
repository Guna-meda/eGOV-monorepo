import pandas as pd
import streamlit as st
import streamlit.components.v1 as components

from src.utils.config import MAPS_DIR, OUTPUTS_DIR

st.set_page_config(page_title="Smart Grievance Mapping", layout="wide")
st.title("Smart Grievance Mapping — ML Intelligence Dashboard")

predictions_path = OUTPUTS_DIR / "complaint_predictions.csv"
risk_path = OUTPUTS_DIR / "ward_risk_scores.csv"
hotspot_path = OUTPUTS_DIR / "hotspot_clusters.csv"
map_path = MAPS_DIR / "smart_grievance_map.html"

if not predictions_path.exists():
    st.warning("Run `python main.py` first to generate ML outputs.")
    st.stop()

complaints = pd.read_csv(predictions_path)
ward_risk = pd.read_csv(risk_path)
hotspots = pd.read_csv(hotspot_path)

metric_cols = st.columns(4)
metric_cols[0].metric("Complaints", len(complaints))
metric_cols[1].metric("Hotspots", len(hotspots))
metric_cols[2].metric("High/Critical", int(complaints["severity_label"].isin(["HIGH", "CRITICAL"]).sum()))
metric_cols[3].metric("High-Risk Wards", int(ward_risk["risk_label"].isin(["HIGH", "CRITICAL"]).sum()))

left, right = st.columns([2, 1])
with left:
    st.subheader("OSM Severity + Risk Map")
    if map_path.exists():
        components.html(map_path.read_text(encoding="utf-8"), height=650)
    else:
        st.info("Map output not found.")

with right:
    st.subheader("Top Ward Risks")
    st.dataframe(
        ward_risk[["admin_ulb_code", "ward_code", "complaint_count", "ml_risk_score", "risk_label", "recommended_action"]].head(15),
        use_container_width=True,
    )
    st.subheader("Category Mix")
    st.bar_chart(complaints["category"].value_counts())

st.subheader("Hotspot Summary")
st.dataframe(hotspots, use_container_width=True)

st.subheader("Complaint Predictions")
show_cols = [
    "complaint_id",
    "category",
    "subcategory",
    "sentiment_label",
    "urgency_label",
    "severity_label",
    "severity_score",
    "hotspot_id",
    "admin_ulb_code",
    "ward_code",
]
st.dataframe(complaints[show_cols], use_container_width=True)
