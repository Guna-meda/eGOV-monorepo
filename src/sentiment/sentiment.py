'''import pandas as pd

NEGATIVE_TERMS = {
    "angry",
    "bad",
    "broken",
    "collapse",
    "cracked",
    "dangerous",
    "delay",
    "dirty",
    "flooded",
    "garbage",
    "help",
    "kami",
    "leakage",
    "missed",
    "mosquito",
    "nahi",
    "no water",
    "overflow",
    "shortage",
    "urgent",
}
URGENCY_TERMS = {"urgent", "dangerous", "collapse", "hospital", "sewage", "no water", "overflow", "flooded", "7 days", "three days"}


def score_sentiment(text: str) -> tuple[str, float]:
    hits = sum(1 for term in NEGATIVE_TERMS if term in text)
    score = max(-1.0, -0.18 * hits)
    if score <= -0.55:
        return "highly_negative", round(score, 3)
    if score <= -0.18:
        return "negative", round(score, 3)
    return "neutral", round(score, 3)


def score_urgency(text: str) -> tuple[str, float]:
    hits = sum(1 for term in URGENCY_TERMS if term in text)
    score = min(1.0, 0.25 + 0.18 * hits)
    if score >= 0.75:
        return "high", round(score, 3)
    if score >= 0.5:
        return "medium", round(score, 3)
    return "low", round(score, 3)


def add_sentiment_features(df: pd.DataFrame) -> pd.DataFrame:
    enriched = df.copy()
    sentiments = enriched["processed_text"].fillna("").map(score_sentiment)
    urgencies = enriched["processed_text"].fillna("").map(score_urgency)
    enriched[["sentiment_label", "sentiment_score"]] = pd.DataFrame(sentiments.tolist(), index=enriched.index)
    enriched[["urgency_label", "urgency_score"]] = pd.DataFrame(urgencies.tolist(), index=enriched.index)
    return enriched'''


import pandas as pd
from transformers import pipeline


# Load once when the file starts
sentiment_model = pipeline(
    "sentiment-analysis",
    model="cardiffnlp/twitter-roberta-base-sentiment-latest",
)


def score_sentiment(text: str) -> tuple[str, float]:
    """
    Returns:
        sentiment_label : positive | neutral | negative
        sentiment_score : -1.0 to 1.0
    """

    if not text or pd.isna(text):
        return "neutral", 0.0

    result = sentiment_model(text)[0]

    sentiment_label = result["label"].lower()
    confidence = result["score"]

    if sentiment_label == "negative":
        sentiment_score = -confidence

    elif sentiment_label == "positive":
        sentiment_score = confidence

    else:
        sentiment_score = 0.0

    return sentiment_label, round(sentiment_score, 3)


def add_sentiment_features(df: pd.DataFrame) -> pd.DataFrame:
    """
    Adds:
        sentiment_label
        sentiment_score

    Requires:
        processed_text column
    """

    enriched = df.copy()

    sentiments = (
        enriched["processed_text"]
        .fillna("")
        .astype(str)
        .map(score_sentiment)
    )

    enriched[
        ["sentiment_label", "sentiment_score"]
    ] = pd.DataFrame(
        sentiments.tolist(),
        index=enriched.index,
    )

    return enriched