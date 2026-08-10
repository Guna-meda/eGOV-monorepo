"""
Utility functions for danger word extraction.
"""

DANGER_WORDS = [

    "fire",
    "electric",
    "electrocution",
    "wire",
    "short",
    "transformer",

    "waterlogging",
    "flood",
    "overflow",
    "drain",
    "sewage",

    "collapse",
    "building",
    "tree",

    "garbage",
    "dead",
    "death",

    "hospital",
    "accident",
    "road",
    "pothole",

    "pollution",
    "smoke",
    "gas",
    "chemical",

    "broken",
    "leak",
    "danger",
    "emergency"
]


def get_danger_score(text: str) -> int:
    """
    Counts how many danger-related keywords
    appear in the complaint.
    """

    if text is None:
        return 0

    text = text.lower()

    score = 0

    for word in DANGER_WORDS:

        if word in text:
            score += 1

    return score