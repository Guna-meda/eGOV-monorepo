import os
import joblib

from catboost import CatBoostRegressor

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

MODEL_PATH = os.path.join(
    BASE_DIR,
    "models",
    "catboost_severity.cbm"
)

TFIDF_PATH = os.path.join(
    BASE_DIR,
    "models",
    "tfidf.pkl"
)

NORMALIZATION_PATH = os.path.join(
    BASE_DIR,
    "models",
    "normalization.pkl"
)


class ModelLoader:

    model = None
    vectorizer = None
    normalization = None

    @classmethod
    def load(cls):

        print("Looking for:")
        print(MODEL_PATH)
        print(TFIDF_PATH)
        print(NORMALIZATION_PATH)

        if not os.path.isfile(MODEL_PATH):
            raise FileNotFoundError(f"Model not found:\n{MODEL_PATH}")

        if not os.path.isfile(TFIDF_PATH):
            raise FileNotFoundError(f"TF-IDF not found:\n{TFIDF_PATH}")

        if not os.path.isfile(NORMALIZATION_PATH):
            raise FileNotFoundError(f"Normalization not found:\n{NORMALIZATION_PATH}")

        cls.model = CatBoostRegressor()
        cls.model.load_model(MODEL_PATH)

        cls.vectorizer = joblib.load(TFIDF_PATH)

        cls.normalization = joblib.load(NORMALIZATION_PATH)

        print("All ML artifacts loaded successfully.")

    @classmethod
    def get_model(cls):
        if cls.model is None:
            cls.load()
        return cls.model

    @classmethod
    def get_vectorizer(cls):
        if cls.vectorizer is None:
            cls.load()
        return cls.vectorizer

    @classmethod
    def get_normalization(cls):
        if cls.normalization is None:
            cls.load()
        return cls.normalization