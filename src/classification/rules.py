CATEGORY_RULES = {
    "water_supply": {
        "no_supply": ["no water", "tap", "taps ran dry", "paani nahi", "water shortage", "water in the tap", "kami", "tanker"],
        "low_pressure": ["low pressure", "slow water", "weak flow"],
        "tanker_delay": ["tanker delay", "arrange tankers", "tanker not"],
        "burst_pipeline": ["burst pipe", "pipeline", "leakage", "pipe broken"],
    },
    "drainage": {
        "waterlogging": ["waterlogging", "rain water", "flooded", "standing water"],
        "blocked_drain": ["blocked drain", "drain blocked", "drain is blocked", "choked drain"],
        "manhole_overflow": ["manhole", "overflow", "drain overflow"],
    },
    "roads": {
        "potholes": ["pothole", "road broken", "crater"],
        "resurfacing": ["resurface", "road surface"],
        "shoulder_damage": ["shoulder damage"],
    },
    "streetlights": {
        "lamp_faulty": ["streetlight", "lamp", "light not working"],
        "feeder_issue": ["feeder"],
        "pole_damage": ["pole damaged", "electric pole"],
    },
    "solid_waste": {
        "missed_pickup": ["garbage pickup", "missed pickup", "not collected"],
        "overflow_bin": ["overflow bin", "dustbin full", "bin overflowing"],
        "dumpsite": ["dump", "garbage heap"],
    },
    "public_health": {
        "mosquito_breeding": ["mosquito", "breeding", "dengue"],
        "stray_dogs": ["stray dog", "dogs"],
        "clinic_availability": ["clinic", "hospital"],
    },
    "sanitation": {
        "public_toilet_faulty": ["public toilet", "toilet faulty"],
        "septic_overflow": ["septic", "sewage", "sewer"],
    },
    "building_safety": {
        "dangerous_structure": ["dangerous", "cracked wall", "old building", "collapse"],
        "illegal_construction": ["illegal construction"],
    },
    "parks": {"broken_play_equipment": ["play equipment", "park broken"], "lawn_irrigation": ["lawn", "irrigation"]},
    "traffic": {"signal_fault": ["signal fault", "traffic signal"], "illegal_parking": ["illegal parking", "parking"]},
    "markets": {"encroachment": ["encroachment"], "license_check": ["license"]},
    "utilities_other": {"electrical_cabinet_open": ["cabinet open"], "cable_hazard": ["cable", "wire"]},
    "grievance_general": {"service_delay": ["delay"], "staff_behavior": ["staff"], "information_request": ["information"]},
}


def classify_by_rules(text: str) -> tuple[str, str, float]:
    scores: list[tuple[int, str, str]] = []
    for category, subcategories in CATEGORY_RULES.items():
        for subcategory, keywords in subcategories.items():
            hits = sum(1 for keyword in keywords if keyword in text)
            if hits:
                scores.append((hits, category, subcategory))
    if not scores:
        return "grievance_general", "information_request", 0.45
    hits, category, subcategory = sorted(scores, reverse=True)[0]
    return category, subcategory, min(0.6 + hits * 0.15, 0.98)
