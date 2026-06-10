"""
USE: Provides a function to assign a category label to a complaint based on the presence of specific keywords in the complaint text based on training data.
"""

CATEGORY_KEYWORDS = {
    "water_supply": [
        "no water", 
        "supply", 
        "tap", 
        "pipeline", 
        "pressure", 
        "tanker"
    ],
    "drainage": [
        "drain", 
        "waterlogging", 
        "manhole", 
        "overflow"
    ],
    "roads": [
        "road", 
        "pothole", 
        "resurfacing", 
        "shoulder"
    ],
    "streetlights": [
        "street light", 
        "lamp", 
        "feeder", 
        "pole", 
        "dark"
    ],
    "solid_waste": [
        "garbage", 
        "waste", 
        "pickup", 
        "bin", 
        "dump"
    ],
    "public_health": [
        "mosquito", 
        "dog", 
        "clinic"
    ],
    "sanitation": [
        "toilet", 
        "septic"
    ],
    "building_safety": [
        "building", 
        "structure", 
        "construction"
    ],
    "parks": [
        "park", 
        "play equipment", 
        "lawn"
    ],
    "traffic": [
        "signal", 
        "parking"
    ],
    "markets": [
        "encroachment", 
        "license"
    ],
    "utilities_other": [
        "electrical cabinet", 
        "cable"
    ],
    "grievance_general": [
        "delay",
        "staff",
        "information",
        "service",
        "response",
        "resolution",
    ],
}


def assign_category(text):

    text = text.lower()

    scores = {}

    for category, keywords in CATEGORY_KEYWORDS.items():

        score = 0

        for keyword in keywords:

            if keyword in text:
                score += 1

        scores[category] = score

    best_category = max(scores, key=scores.get)

    if scores[best_category] == 0:
        return "unknown"

    return best_category
