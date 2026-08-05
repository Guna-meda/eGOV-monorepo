from pathlib import Path

from catboost import CatBoostRegressor
from sentence_transformers import SentenceTransformer


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

            model_path = (
                Path(__file__).resolve().parent.parent
                / "models"
                / "severity_model.cbm"
            )

            print(f"Loading CatBoost model from: {model_path}")

            cls._model = CatBoostRegressor()
            cls._model.load_model(str(model_path))

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