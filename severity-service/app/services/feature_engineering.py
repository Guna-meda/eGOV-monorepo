from app.model_loader import ModelLoader
from app.services.preprocessing import TextPreprocessor


class FeatureEngineering:

    @staticmethod
    def build_features(request):

        # ---------------------------------------------
        # Clean Complaint Text
        # ---------------------------------------------

        clean_text = TextPreprocessor.clean(
            request.description
        )

        # ---------------------------------------------
        # Load Sentence Transformer
        # ---------------------------------------------

        embedder = ModelLoader.get_embedder()

        # ---------------------------------------------
        # Generate Embedding
        # ---------------------------------------------

        embedding = embedder.encode(
            [clean_text],
            convert_to_numpy=True
        )

        # embedding shape = (1, 384)

        return embedding