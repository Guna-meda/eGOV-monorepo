import argparse
import json
import sys

import joblib

from src.classification.rules import CATEGORY_RULES, classify_by_rules
from src.preprocessing.text_cleaning import normalize_text
from src.preprocessing.translation import translate_to_english
from src.sentiment.sentiment import score_sentiment
from src.severity.severity_engine import DANGER_CATEGORIES
from src.utils.config import MODELS_DIR


def _default_subcategory(category: str) -> str:
    subcategories = CATEGORY_RULES.get(category, {})
    return next(iter(subcategories), "information_request")


def _load_category_model():
    model_path = MODELS_DIR / "category_classifier" / "tfidf_logreg.joblib"
    if not model_path.exists():
        return None
    return joblib.load(model_path)


def _severity_label(score: float) -> str:
    if score >= 0.8:
        return "CRITICAL"
    if score >= 0.6:
        return "HIGH"
    if score >= 0.35:
        return "MEDIUM"
    return "LOW"


def predict_complaint(
    text: str,
    translate: bool = False,
    lang: str = "hi",
    use_pretrained_translation: bool = True,
    translation_backend: str = "auto",
) -> dict[str, object]:
    translation = None
    if translate:
        translation = translate_to_english(
            text,
            lang=lang,
            use_pretrained=use_pretrained_translation,
            backend=translation_backend,
        )
        text_for_model = translation["translated_text"]
    else:
        text_for_model = text

    processed_text = normalize_text(text_for_model)
    rule_category, rule_subcategory, rule_confidence = classify_by_rules(processed_text)
    category = rule_category
    category_confidence = round(rule_confidence, 4)
    model_used = "rules"

    model = _load_category_model()
    if model is not None and processed_text:
        probabilities = model.predict_proba([processed_text])[0]
        predicted_category = model.classes_[probabilities.argmax()]
        predicted_confidence = float(probabilities.max())
        if predicted_confidence >= 0.5 or rule_category == "grievance_general":
            category = predicted_category
            category_confidence = round(predicted_confidence, 4)
            model_used = "tfidf_logreg"
        else:
            model_used = "rules_low_ml_confidence"

    subcategory = (rule_subcategory if category == rule_category else _default_subcategory(category))
    sentiment_label, sentiment_score = score_sentiment(processed_text)
    danger_weight = 0.16 if category in DANGER_CATEGORIES else 0.0
    strong_negative_weight = 0.08 if sentiment_label == "highly_negative" else 0.0
    severity_score = round(min(1.0, 0.18 + danger_weight + strong_negative_weight), 3)

    return {
        "input_text": text,
        "translated_text": text_for_model if translate else "",
        "translation_model": translation["translation_model"] if translation else "",
        "processed_text": processed_text,
        "model_used": model_used,
        "category": category,
        "subcategory": subcategory,
        "category_confidence": category_confidence,
        "sentiment_label": sentiment_label,
        "sentiment_score": sentiment_score,
        "severity_label": _severity_label(severity_score),
        "severity_score": severity_score,
    }


def main() -> None:
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")
    parser = argparse.ArgumentParser(
        description="Predict ML labels for one grievance complaint string."
    )
    parser.add_argument("text", nargs="*", help="Complaint text to classify.")
    parser.add_argument(
        "--translate",
        action="store_true",
        help="Translate Hindi/Marathi/Hinglish text to English before prediction.",
    )
    parser.add_argument(
        "--lang",
        default="hi",
        choices=["hi", "mr"],
        help="Source language hint for translation.",
    )
    parser.add_argument(
        "--translation-backend",
        default="auto",
        choices=[
            "auto",
            "helsinki",
            "seamless",
            "indictrans2",
            "aksharamukha",
            "phrase",
        ],
        help="Translation/transliteration backend.",
    )
    parser.add_argument(
        "--no-pretrained-translation",
        action="store_true",
        help="Use only Hinglish phrase normalization before prediction.",
    )
    parser.add_argument(
        "--json", action="store_true", help="Print machine-readable JSON."
    )
    args = parser.parse_args()

    complaint_text = " ".join(args.text).strip()
    if not complaint_text:
        complaint_text = input("Enter complaint: ").strip()

    prediction = predict_complaint(
        complaint_text,
        translate=args.translate,
        lang=args.lang,
        use_pretrained_translation=not args.no_pretrained_translation,
        translation_backend=(
            "phrase" if args.no_pretrained_translation else args.translation_backend
        ),
    )
    if args.json:
        print(json.dumps(prediction, indent=2))
        return

    print("\nPrediction")
    print("-" * 40)
    print(f"Category     : {prediction['category']}")
    if prediction["translated_text"]:
        print(f"English text : {prediction['translated_text']}")
    print(f"Subcategory  : {prediction['subcategory']}")
    print(f"Confidence   : {prediction['category_confidence']}")
    print(
        f"Sentiment    : {prediction['sentiment_label']} ({prediction['sentiment_score']})"
    )
    print(
        f"Severity     : {prediction['severity_label']} ({prediction['severity_score']})"
    )
    print(f"Model used   : {prediction['model_used']}")


if __name__ == "__main__":
    main()

