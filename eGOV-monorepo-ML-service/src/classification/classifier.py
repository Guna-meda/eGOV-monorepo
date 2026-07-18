import joblib
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline

from src.classification.rules import classify_by_rules
from src.utils.config import MODELS_DIR, RANDOM_SEED


def add_rule_labels(df: pd.DataFrame) -> pd.DataFrame:
    labelled = df.copy()
    predictions = labelled["processed_text"].fillna("").map(classify_by_rules)
    labelled[["category", "subcategory", "category_confidence"]] = pd.DataFrame(predictions.tolist(), index=labelled.index)
    return labelled


def train_category_model(df: pd.DataFrame) -> Pipeline | None:
    train_df = df[df["processed_text"].str.len().fillna(0) > 0].copy()
    if train_df["category"].nunique() < 2:
        return None
    model = Pipeline(
        [
            ("tfidf", TfidfVectorizer(ngram_range=(1, 2), min_df=1, max_features=8000)),
            ("clf", LogisticRegression(max_iter=1000, class_weight="balanced", random_state=RANDOM_SEED)),
        ]
    )
    model.fit(train_df["processed_text"], train_df["category"])
    model_dir = MODELS_DIR / "category_classifier"
    model_dir.mkdir(parents=True, exist_ok=True)
    joblib.dump(model, model_dir / "tfidf_logreg.joblib")
    return model


def classify_complaints(df: pd.DataFrame) -> pd.DataFrame:
    labelled = add_rule_labels(df)
    model = train_category_model(labelled)
    if model is not None:
        labelled["ml_category"] = model.predict(labelled["processed_text"].fillna(""))
        probabilities = model.predict_proba(labelled["processed_text"].fillna(""))
        labelled["ml_category_confidence"] = probabilities.max(axis=1).round(4)
    else:
        labelled["ml_category"] = labelled["category"]
        labelled["ml_category_confidence"] = labelled["category_confidence"]
    return labelled
