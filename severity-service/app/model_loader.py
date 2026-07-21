from pathlib import Path

from catboost import CatBoostRegressor


class ModelLoader:
    """
    Loads and provides access to the ML artifacts used by the Severity Service.
    """

    _model = None
    _embedder = None

    @classmethod
    def load(cls, include_embedder: bool = False):
        """
        Load lightweight artifacts at startup.

        SentenceTransformer imports torch and loads a large model, so it stays
        lazy by default. That lets low-memory hosts bind a port before the first
        severity prediction request.
        """
        cls.load_model()

        if include_embedder:
            cls.load_embedder()

    @classmethod
    def load_model(cls):
        """
        Load the CatBoost model only.
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

            print("CatBoost model loaded successfully.")

    @classmethod
    def load_embedder(cls):
        """
        Load the Sentence Transformer only when /severity needs it.
        """
        if cls._embedder is None:
            from sentence_transformers import SentenceTransformer

            print("Loading Sentence Transformer...")

            cls._embedder = SentenceTransformer(
                "all-MiniLM-L6-v2",
                device="cpu",
            )

            print("Sentence Transformer loaded successfully.")

    @classmethod
    def get_model(cls):
        """
        Returns the loaded CatBoost model.
        """
        if cls._model is None:
            cls.load_model()

        return cls._model

    @classmethod
    def get_embedder(cls):
        """
        Returns the loaded Sentence Transformer.
        """
        if cls._embedder is None:
            cls.load_embedder()

        return cls._embedder
