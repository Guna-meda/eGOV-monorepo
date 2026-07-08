from functools import lru_cache
from pathlib import Path
import re

import joblib
import numpy as np

from src.classification.mdms import service_lookup


PROJECT_ROOT = Path(__file__).resolve().parents[2]

MODEL_CANDIDATES = [
    PROJECT_ROOT / "models" / "classification" / "tfidf_lsvm_servicecode.pkl",
    PROJECT_ROOT / "models" / "tfidf_lsvm_servicecode.pkl",
    PROJECT_ROOT / "src" / "classification" / "tfidf_lsvm_servicecode.pkl",
    PROJECT_ROOT / "models" / "servicecode_classifier.pkl",
]

SPLIT_MODEL_DIR_CANDIDATES = [
    PROJECT_ROOT / "models" / "category_classifier",
    PROJECT_ROOT / "models" / "classification",
]

MENU_LOOKUP_CANDIDATES = [
    PROJECT_ROOT / "models" / "category_classifier" / "servicecode_to_menupath.pkl",
    PROJECT_ROOT / "models" / "classification" / "servicecode_to_menupath.pkl",
    PROJECT_ROOT / "models" / "servicecode_to_menupath.pkl",
    PROJECT_ROOT / "src" / "classification" / "servicecode_to_menupath.pkl",
]


VULNERABLE_TERMS = {
    "hospital",
    "government hospital",
    "clinic",
    "school",
    "college",
    "hostel",
    "children",
    "child",
    "elderly",
    "senior citizen",
    "pregnant",
    "disabled",
    "patient",
    "ambulance",
    "orphanage",
    "kindergarten",
}

CRITICALITY_LEVELS = (
    (
        4,
        {
            "electric shock",
            "live wire",
            "gas leak",
            "fire",
            "building collapse",
            "road collapse",
            "bridge collapse",
            "open manhole",
            "transformer burst",
            "high voltage",
            "electrocution",
            "short circuit",
        },
    ),
    (
        3,
        {
            "no water",
            "water supply",
            "drinking water",
            "no electricity",
            "power outage",
            "power failure",
            "sewer overflow",
            "sewage overflow",
            "flood",
            "flooding",
            "drain blockage",
            "water logging",
        },
    ),
    (
        2,
        {
            "pothole",
            "road damage",
            "road repair",
            "tree fallen",
            "street light",
            "footpath",
            "garbage",
            "debris",
            "drain",
            "waste",
        },
    ),
    (
        1,
        {
            "park",
            "playground",
            "street dog",
            "encroachment",
            "painting",
            "cleanliness",
        },
    ),
)

REPETITION_TERMS = ("again", "still", "repeated", "multiple", "every year", "yet", "unresolved")


def _first_existing_path(paths: list[Path]) -> Path | None:
    return next((path for path in paths if path.exists()), None)


@lru_cache(maxsize=1)
def _load_model():
    model_path = _first_existing_path(MODEL_CANDIDATES)
    if model_path is not None:
        return joblib.load(model_path)

    for model_dir in SPLIT_MODEL_DIR_CANDIDATES:
        classifier_path = model_dir / "linear_svm_servicecode.pkl"
        vectorizer_path = model_dir / "tfidf_vectorizer.pkl"
        label_encoder_path = model_dir / "label_encoder.pkl"
        if classifier_path.exists() and vectorizer_path.exists() and label_encoder_path.exists():
            return {
                "classifier": joblib.load(classifier_path),
                "vectorizer": joblib.load(vectorizer_path),
                "label_encoder": joblib.load(label_encoder_path),
            }

    searched = ", ".join(str(path) for path in MODEL_CANDIDATES)
    searched_split = ", ".join(str(path) for path in SPLIT_MODEL_DIR_CANDIDATES)
    raise FileNotFoundError(
        "Service-code classifier model not found. "
        "Expected either a single pipeline artifact or the split artifacts "
        "linear_svm_servicecode.pkl, tfidf_vectorizer.pkl, and label_encoder.pkl. "
        f"Searched pipeline files: {searched}. Searched split model directories: {searched_split}"
    )


@lru_cache(maxsize=1)
def _load_menu_lookup() -> dict[str, str]:
    lookup_path = _first_existing_path(MENU_LOOKUP_CANDIDATES)
    if lookup_path is None:
        return {
            code: service.get("menuPath", "")
            for code, service in service_lookup.items()
        }
    return joblib.load(lookup_path)


def _classes(model) -> np.ndarray:
    if isinstance(model, dict):
        classifier = model["classifier"]
        label_encoder = model["label_encoder"]
        classifier_classes = getattr(classifier, "classes_", None)
        if classifier_classes is not None and hasattr(label_encoder, "inverse_transform"):
            return np.asarray(label_encoder.inverse_transform(classifier_classes))
        return np.asarray(getattr(label_encoder, "classes_"))

    if hasattr(model, "classes_"):
        return np.asarray(model.classes_)

    for step_name in ("classifier", "clf"):
        step = getattr(model, "named_steps", {}).get(step_name)
        if step is not None and hasattr(step, "classes_"):
            return np.asarray(step.classes_)

    raise ValueError("Classifier classes could not be found on the loaded model.")


def _softmax(scores: np.ndarray) -> np.ndarray:
    scores = np.asarray(scores, dtype=float)
    scores = scores - np.max(scores)
    exp_scores = np.exp(scores)
    return exp_scores / exp_scores.sum()


def _predict_probabilities(model, text: str) -> tuple[np.ndarray, np.ndarray]:
    classes = _classes(model)
    prediction_input = [text]

    if isinstance(model, dict):
        classifier = model["classifier"]
        prediction_input = model["vectorizer"].transform(prediction_input)

        if hasattr(classifier, "predict_proba"):
            probabilities = classifier.predict_proba(prediction_input)[0]
            return classes, np.asarray(probabilities, dtype=float)

        if not hasattr(classifier, "decision_function"):
            raise ValueError("Loaded split classifier must expose predict_proba or decision_function.")

        scores = np.asarray(classifier.decision_function(prediction_input)[0], dtype=float)
        return classes, _softmax(scores)

    if hasattr(model, "predict_proba"):
        probabilities = model.predict_proba(prediction_input)[0]
        return classes, np.asarray(probabilities, dtype=float)

    if not hasattr(model, "decision_function"):
        raise ValueError("Loaded classifier must expose predict_proba or decision_function.")

    scores = np.asarray(model.decision_function(prediction_input)[0], dtype=float)
    if scores.ndim == 0:
        scores = np.asarray([-scores, scores], dtype=float)
    if len(classes) == 2 and scores.ndim == 1 and len(scores) == 1:
        scores = np.asarray([-scores[0], scores[0]], dtype=float)

    return classes, _softmax(scores)


def _time_score(text: str) -> tuple[int, float]:
    matches = re.findall(
        r"(\d+)\s*(hour|hours|day|days|week|weeks|month|months|year|years)",
        text,
    )

    total_days = 0.0
    for value, unit in matches:
        amount = int(value)
        if "hour" in unit:
            total_days += amount / 24
        elif "day" in unit:
            total_days += amount
        elif "week" in unit:
            total_days += amount * 7
        elif "month" in unit:
            total_days += amount * 30
        elif "year" in unit:
            total_days += amount * 365

    if total_days == 0:
        return 0, total_days
    if total_days <= 7:
        return 1, total_days
    if total_days <= 30:
        return 2, total_days
    if total_days <= 90:
        return 3, total_days
    return 4, total_days


def _criticality_score(text: str) -> tuple[int, list[str]]:
    for score, terms in CRITICALITY_LEVELS:
        matched = sorted(term for term in terms if term in text)
        if matched:
            return score, matched
    return 0, []


def _vulnerability_score(text: str) -> tuple[int, list[str]]:
    matched = sorted(term for term in VULNERABLE_TERMS if term in text)
    return min(len(set(matched)), 3), matched


def _repetition_score(text: str) -> tuple[int, list[str]]:
    score = 0
    matched = []

    for term in REPETITION_TERMS:
        if term in text:
            matched.append(term)
            score += 1

    complaint_counts = re.findall(r"(\d+)(st|nd|rd|th)?\s*(complaint|time|times)", text)
    if complaint_counts:
        count = int(complaint_counts[0][0])
        if count == 2:
            score += 1
        elif count == 3:
            score += 2
        elif count > 3:
            score += 3
        matched.append(f"{count} complaints")

    return min(score, 3), matched


def _urgency(text: str) -> tuple[str, list[str]]:
    normalized = text.lower()
    time_score, days = _time_score(normalized)
    critical_score, critical = _criticality_score(normalized)
    vulnerability_score, vulnerable = _vulnerability_score(normalized)
    repetition_score, repetition = _repetition_score(normalized)

    final_score = time_score + critical_score + vulnerability_score + repetition_score

    if final_score <= 4:
        urgency = "low"
    elif final_score <= 9:
        urgency = "medium"
    else:
        urgency = "high"

    signals = []
    if time_score:
        signals.append(f"time:{days:g}_days")
    signals.extend(f"critical:{term}" for term in critical)
    signals.extend(f"vulnerability:{term}" for term in vulnerable)
    signals.extend(f"repetition:{term}" for term in repetition)

    return urgency, signals


def _service_suggestion(code: str, confidence: float, menu_lookup: dict[str, str]) -> dict:
    mdms = service_lookup[code]
    menu_path = menu_lookup.get(code) or mdms.get("menuPath", "")
    return {
        "serviceCode": code,
        "name": mdms.get("name", code),
        "menuPath": menu_path,
        "category": menu_path,
        "confidence": round(float(confidence), 4),
    }


def _selected_menu_path(selected_service_code: str | None) -> str | None:
    if not selected_service_code:
        return None

    selected = selected_service_code.strip()
    if selected in service_lookup:
        return service_lookup[selected].get("menuPath")

    normalized = selected.lower()
    for code, service in service_lookup.items():
        if code.lower() == normalized:
            return service.get("menuPath")

    menu_paths = {
        str(service.get("menuPath", "")).lower(): service.get("menuPath")
        for service in service_lookup.values()
        if service.get("menuPath")
    }
    return menu_paths.get(normalized)


def predict(text: str, selected_service_code: str | None = None) -> dict:
    model = _load_model()
    menu_lookup = _load_menu_lookup()
    classes, probabilities = _predict_probabilities(model, text)

    ranked_indices = np.argsort(probabilities)[::-1]
    suggestions = []

    for index in ranked_indices:
        code = str(classes[index])
        if code not in service_lookup:
            continue
        suggestions.append(_service_suggestion(code, probabilities[index], menu_lookup))
        if len(suggestions) == 3:
            break

    if not suggestions:
        raise ValueError("Model predictions did not match any serviceCode in Rainmaker MDMS data.")

    best = suggestions[0]
    top_confidence = best["confidence"]
    second_confidence = suggestions[1]["confidence"] if len(suggestions) > 1 else 0.0
    low_confidence = top_confidence < 0.5 or (top_confidence - second_confidence) < 0.1

    selected_menu_path = _selected_menu_path(selected_service_code)

    urgency, urgency_signals = _urgency(text)

    return {
        "urgency": urgency,
        "urgency_signals": urgency_signals,
        "predicted_service_code": best["serviceCode"],
        "predicted_menu_path": best["menuPath"],
        "predicted_category": best["menuPath"],
        "suggested_service_codes": suggestions,
        "confidence": [suggestion["confidence"] for suggestion in suggestions],
        "low_confidence": low_confidence,
        "possible_mismatch": bool(
            selected_service_code
            and selected_menu_path is not None
            and selected_menu_path != best["menuPath"]
        ),
    }
