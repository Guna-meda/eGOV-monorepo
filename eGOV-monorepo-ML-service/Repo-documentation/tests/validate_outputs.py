from pathlib import Path

import pandas as pd


ROOT = Path(__file__).resolve().parents[1]
OUTPUTS = ROOT / "outputs"


def main() -> None:
    complaints = pd.read_csv(OUTPUTS / "complaint_predictions.csv")
    ward_risk = pd.read_csv(OUTPUTS / "ward_risk_scores.csv")
    hotspots = pd.read_csv(OUTPUTS / "hotspot_clusters.csv")

    assert complaints["complaint_id"].is_unique, "Complaint output must have unique complaint_id rows."
    required = {"category", "subcategory", "sentiment_label", "urgency_label", "severity_score", "severity_label", "hotspot_id"}
    assert required.issubset(complaints.columns), f"Missing columns: {required - set(complaints.columns)}"
    assert complaints["severity_score"].between(0, 1).all(), "Severity scores must be 0..1."
    assert ward_risk["ml_risk_score"].between(0, 1).all(), "Risk scores must be 0..1."
    assert len(ward_risk) > 0, "Ward risk output is empty."
    assert hotspots.columns.isin(["hotspot_id", "category", "complaint_count", "center_lat", "center_lon"]).any(), "Hotspot output malformed."
    print("Output validation passed.")


if __name__ == "__main__":
    main()
