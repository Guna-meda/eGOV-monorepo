from catboost import CatBoostRegressor
from sentence_transformers import SentenceTransformer

from app.config import CATBOOST_MODEL_PATH


class ModelLoader:
    """
    Loads and provides access to the ML artifacts
    used by the Severity Service.
    """

    _model = None
    _embedder = None

    @classmethod
    def load(cls):
        """
        Load ONLY the CatBoost model during startup.
        SentenceTransformer will be loaded lazily.
        """

        if cls._model is None:

            print(f"Loading CatBoost model from: {CATBOOST_MODEL_PATH}")

            cls._model = CatBoostRegressor()
            cls._model.load_model(str(CATBOOST_MODEL_PATH))

            print("✓ CatBoost model loaded successfully.")

    @classmethod
    def get_model(cls):

        if cls._model is None:
            cls.load()

        return cls._model

    @classmethod
    def get_embedder(cls):
        """
        Lazy load SentenceTransformer only when first required.
        """

        if cls._embedder is None:

            print("Loading Sentence Transformer...")

            cls._embedder = SentenceTransformer(
                "all-MiniLM-L6-v2"
            )

            print("✓ Sentence Transformer loaded successfully.")

        return cls._embedder