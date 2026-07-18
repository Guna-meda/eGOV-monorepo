# Smart Grievance Mapping — ML Layer

This repository implements the ML part of the eGov Smart Grievance Mapping project using the structure from the architecture PDF: `data/`, `notebooks/`, `src/`, `models/`, `outputs/`, `app/`, and `tests/`.

## What It Does

- Normalizes multilingual/code-mixed ASR complaint text.
- Auto-classifies category and subcategory using keyword weak labels plus a TF-IDF Logistic Regression model.
- Scores sentiment, urgency, civic severity, hotspot membership, and ward-level future risk.
- Detects recurring geospatial complaint hotspots with DBSCAN.
- Generates CSV outputs and an OpenStreetMap/Folium dashboard.

## Setup

```bash
python -m pip install -r requirements.txt
```

## Run

```bash
python main.py
python tests/validate_outputs.py
streamlit run app/streamlit_app.py
```

Test one custom complaint without UI:

```bash
python predict_complaint.py "There is no water in our tap for three days, please arrange tanker urgently"
```

Optional Hinglish/Hindi/Marathi translation support:

```bash
python -m pip install -r requirements-translation.txt
python translate_complaint.py "paani nahi aa raha teen din se tanker bhejo" --lang hi
python predict_complaint.py "paani nahi aa raha teen din se tanker bhejo" --translate --lang hi
```

Choose a conversion backend explicitly:

```bash
python translate_complaint.py "पानी नहीं आ रहा है तीन दिन से टैंकर भेजो" --lang hi --backend helsinki
python translate_complaint.py "पानी नहीं आ रहा है तीन दिन से टैंकर भेजो" --lang hi --backend aksharamukha
python predict_complaint.py "पानी नहीं आ रहा है तीन दिन से टैंकर भेजो" --translate --lang hi --translation-backend helsinki
python predict_complaint.py "paani nahi aa raha teen din se tanker bhejo" --translate --translation-backend phrase
```

Backend notes:

- `helsinki` / `auto`: pretrained Hindi/Marathi-to-English translation with civic keyword glosses.
- `aksharamukha`: transliteration only, useful for script conversion/debugging; it does not translate meaning.
- `seamless`: optional SeamlessM4T hook; downloads a large Meta model on first use.
- `indictrans2`: placeholder hook for AI4Bharat IndicTrans2; use after installing its official inference package/checkpoints.

If you do not want to download pretrained models, use the lightweight phrase normalizer:

```bash
python predict_complaint.py "paani nahi aa raha teen din se tanker bhejo" --translate --no-pretrained-translation
```

## Inputs

Raw files are stored in `data/raw/`:

- `ids_intake.csv`
- `text_asr.csv`
- `geo_osm.csv`
- `workflow.csv`
- `evidence.csv`

## Outputs

- `data/processed/processed_text.csv`
- `data/processed/workflow_features.csv`
- `outputs/complaint_predictions.csv`
- `outputs/hotspot_clusters.csv`
- `outputs/ward_risk_scores.csv`
- `outputs/maps/smart_grievance_map.html`

## ML Design

Severity and sentiment are intentionally separate. Sentiment measures citizen frustration; severity measures civic/infrastructure seriousness using urgency, category danger, workflow escalation, SLA breach, unresolved status, and local complaint density. Risk is ward-level and predictive, combining severity, complaint density, hotspot recurrence, SLA breach, unresolved rate, and escalation rate.
