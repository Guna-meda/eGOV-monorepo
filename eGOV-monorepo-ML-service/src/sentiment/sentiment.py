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