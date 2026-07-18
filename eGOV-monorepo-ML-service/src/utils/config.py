from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parents[2]
DATA_RAW_DIR = ROOT_DIR / "data" / "raw"
DATA_PROCESSED_DIR = ROOT_DIR / "data" / "processed"
OUTPUTS_DIR = ROOT_DIR / "outputs"
MAPS_DIR = OUTPUTS_DIR / "maps"
MODELS_DIR = ROOT_DIR / "models"

INTAKE_PATH = DATA_RAW_DIR / "ids_intake.csv"
TEXT_ASR_PATH = DATA_RAW_DIR / "text_asr.csv"
GEO_PATH = DATA_RAW_DIR / "geo_osm.csv"
WORKFLOW_PATH = DATA_RAW_DIR / "workflow.csv"
EVIDENCE_PATH = DATA_RAW_DIR / "evidence.csv"

RANDOM_SEED = 42

CATEGORY_DEPARTMENTS = {
    "water_supply": "WATER",
    "drainage": "DRAINAGE",
    "roads": "ROADS",
    "streetlights": "ELECTRICAL",
    "solid_waste": "SANITATION",
    "public_health": "HEALTH",
    "sanitation": "SANITATION",
    "building_safety": "BUILDING",
    "parks": "PARKS",
    "traffic": "TRAFFIC",
    "markets": "MARKET",
    "utilities_other": "UTILITIES",
    "grievance_general": "ADMIN",
}
