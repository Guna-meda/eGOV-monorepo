'''
USE: Provides a function to assign a subcategory label to a complaint based on the presence of specific keywords in the complaint text based on training data.
'''
import re

SUBCATEGORY_MAP = {
    "water_supply": {
        "no_supply": [
            "no water", 
            "water not coming", 
            "dry tap", 
            "supply stopped"
        ],
        "low_pressure": [
            "low pressure", 
            "weak flow", 
            "slow flow"
        ]            ,
        "tanker_delay": [
            "tanker", 
            "tanker delayed", 
            "tanker did not arrive"
        ],
        "burst_pipeline": [
            "pipe leak", 
            "pipeline burst", 
            "burst pipe"
        ],
    },
    "drainage": {
        "waterlogging": [
            "waterlogging", 
            "flooded"
        ],
        "blocked_drain": [
            "blocked drain", 
            "drain clogged"
        ],
        "manhole_overflow": [
            "manhole", 
            "overflow"
        ],
    },
    "roads": {
        "pothole": [
            "pothole", 
            "road damage"
        ],
        "resurfacing": [
            "resurface", 
            "road repair"
        ],
        "shoulder": [
            "shoulder damage", 
            "road shoulder"
        ],
    },
    "streetlights": {
        "lamp_faulty": [
            "street light out",
            "lamp not working",
            "dark area",
            "poor lighting",
        ],
        "feeder_issue": [
            "feeder", 
            "electrical issue"
        ],
        "pole_damage": [
            "pole damage", 
            "broken pole"
        ],
    },
    "solid_waste": {
        "missed_pickup": [
            "garbage pickup",
            "waste collection", 
            "missed pickup"
        ],
        "overflow_bin": [
            "bin", 
            "overflowing bin", 
            "full bin"
        ],
        "dumpsite": [
            "dump site", 
            "illegal dumping", 
            "garbage dump"
        ],
    },
    "public_health": {
        "mosquito_breeding": [
            "mosquito",
            "mosquito breeding",
            "stagnant water",
            "mosquitoes",
            "breeding ground",
        ],
        "stray_dogs": [
            "stray dog",
            "dog bite",
            "dogs roaming",
            "aggressive dog",
            "dog menace",
        ],
        "clinic_availability": [
            "clinic closed",
            "doctor unavailable",
            "hospital",
            "health center",
            "medical facility",
            "clinic",
        ],
    },
    "sanitation": {
        "toilet_faulty": [
            "toilet", 
            "public toilet", 
            "restroom", 
            "toilet not working"
        ],
        "septic_overflow": [
            "septic tank", 
            "sewage issue"
        ],
    },
    "building_safety": {
        "dangerous_structure": [
            "dangerous building",
            "unsafe structure",
            "cracked building",
            "building collapse",
            "falling wall",
            "damaged structure",
        ],
        "illegal_construction": [
            "illegal construction",
            "unauthorized construction",
            "encroachment building",
            "building violation",
            "construction without permit",
        ],
    },
    "parks": {
        "broken_equipment": [
            "broken swing",
            "broken slide",
            "play equipment",
            "playground equipment",
            "damaged equipment",
        ],
        "lawn_maintenance": [
            "dry lawn",
            "overgrown grass",
            'lawn',
            "park maintenance",
            "grass maintenance",
        ],
    },
    "traffic": {
        "signal_issue": [
            "signal", 
            "traffic light", 
            "signal not working"
        ],
        "illegal_parking": [
            "parking", 
            "illegal parking", 
            "parking issue"
        ],
    },
    "markets": {
        "encroachment": [
            "encroachment", 
            "illegal structure"
        ],
        "license": [
            "license", 
            "vendor license"
        ],
    },
    "utilities_other": {
        "electrical_cabinet": [
            "electrical cabinet", 
            "power box",
            "open cabinet",
            "electric panel",
        ],
        "cable_issue": [
            "hanging wire",
            "loose wire",
            "cable hazard",
            "wire",
            "cable",
        ],
    },
    "grievance_general": {
        "service_delay": [
            "delay",
            "slow response",
            "poor service",
            "service delay",
            "service",
            "problem not solved",
        ],
        "staff_behaviour": [
            "staff", 
            "employee behavior"
        ],
        "information_request": [
            "information", 
            "lack of information"
        ],
        "response": [
            "response", 
            "no response"
        ],
    },
}


'''def assign_subcategory(text, category):

    text = text.lower()

    if category not in SUBCATEGORY_MAP:
        return "unknown"

    scores = {}

    for subcat, keywords in SUBCATEGORY_MAP[category].items():

        score = 0

        for keyword in keywords:

            matches = len(re.findall(rf"\b{re.escape(keyword)}\b", text))

            score += matches

        scores[subcat] = score

    best_subcat = max(scores, key=scores.get)

    if scores[best_subcat] == 0:
        return "unknown"

    return best_subcat'''

def assign_subcategory(text, category):
    text = text.lower()

    if category == "water_supply":

        scores = {}

        for subcat, keywords in SUBCATEGORY_MAP["water_supply"].items():

            score = 0

            for keyword in keywords:
                if keyword in text:
                    score += 1

            scores[subcat] = score

        best = max(scores, key=scores.get)

        if scores[best] > 0:
            return best

    return category
