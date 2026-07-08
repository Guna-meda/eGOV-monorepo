import joblib
import numpy as np

from mdms import service_lookup

model = joblib.load("models/servicecode_classifier.pkl")

menu_lookup = joblib.load("models/servicecode_to_menupath.pkl")


def predict(text, selected_service_code=None):

    probs = model.predict_proba([text])[0]
    classes = model.named_steps["classifier"].classes_
    idx = np.argsort(probs)[::-1][:3]

    suggestions = []

    for i in idx:

        code = classes[i]
        mdms = service_lookup[code]
        suggestions.append(
            {
                "serviceCode": code,
                "name": mdms["name"],
                "category": mdms["menuPath"],
                "confidence": float(probs[i]),
            }
        )

    best = suggestions[0]

    return {
        "predicted_category": best["category"],
        "predicted_service_code": best["serviceCode"],
        "suggested_service_codes": suggestions,
        "low_confidence": best["confidence"] < 0.6,
        "possible_mismatch": selected_service_code is not None
        and selected_service_code != best["serviceCode"],
    }
