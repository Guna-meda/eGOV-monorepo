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
        Load the CatBoost model and Sentence Transformer
        only once during application startup.
        """

        if cls._model is None:

            model_path = (
            Path(__file__).resolve().parent.parent
             / "models"
             / "catboost_model.cbm"
            )

            print(f"Loading CatBoost model from: {model_path}")

            cls._model = CatBoostRegressor()
            cls._model.load_model(str(model_path))

            print("✓ CatBoost model loaded successfully.")

        if cls._embedder is None:

            print("Loading Sentence Transformer...")

            cls._embedder = SentenceTransformer(
                "all-MiniLM-L6-v2"
            )

            print("✓ Sentence Transformer loaded successfully.")

    @classmethod
    def get_model(cls):
        """
        Returns the loaded CatBoost model.
        """

        if cls._model is None:
            raise RuntimeError(
                "CatBoost model has not been loaded."
            )

        return cls._model

    @classmethod
    def get_embedder(cls):
        """
        Returns the loaded Sentence Transformer.
        """

        if cls._embedder is None:
            raise RuntimeError(
                "Sentence Transformer has not been loaded."
            )

        return cls._embedder