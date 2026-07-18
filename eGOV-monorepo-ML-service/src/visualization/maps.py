import folium
from folium.plugins import HeatMap, MarkerCluster
import pandas as pd


def build_osm_map(complaints: pd.DataFrame, ward_risk: pd.DataFrame, output_path) -> None:
    valid = complaints[complaints["has_valid_location"].fillna(False)].copy()
    if valid.empty:
        return
    center = [valid["lat"].mean(), valid["lon"].mean()]
    fmap = folium.Map(location=center, zoom_start=11, tiles="OpenStreetMap")

    HeatMap(valid[["lat", "lon", "severity_score"]].dropna().values.tolist(), name="Severity heatmap", radius=14).add_to(fmap)
    cluster = MarkerCluster(name="Complaint clusters").add_to(fmap)
    colors = {"CRITICAL": "red", "HIGH": "orange", "MEDIUM": "blue", "LOW": "green"}
    for row in valid.itertuples():
        popup = (
            f"<b>{row.complaint_id}</b><br>Category: {row.category}<br>"
            f"Severity: {row.severity_label} ({row.severity_score})<br>"
            f"Sentiment: {row.sentiment_label}<br>Ward: {row.ward_code}"
        )
        folium.CircleMarker(
            location=[row.lat, row.lon],
            radius=5,
            color=colors.get(row.severity_label, "gray"),
            fill=True,
            fill_opacity=0.75,
            popup=popup,
        ).add_to(cluster)

    for row in ward_risk.dropna(subset=["lat", "lon"]).itertuples():
        folium.Marker(
            location=[row.lat, row.lon],
            icon=folium.Icon(color=colors.get(row.risk_label, "gray"), icon="warning-sign"),
            popup=f"<b>{row.admin_ulb_code} {row.ward_code}</b><br>Risk: {row.risk_label} ({row.ml_risk_score})<br>{row.recommended_action}",
        ).add_to(fmap)

    folium.LayerControl().add_to(fmap)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    fmap.save(str(output_path))
