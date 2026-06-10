import joblib
import pandas as pd

from src.classification.embeddings import EmbeddingGenerator


class CategoryInference:

    def __init__(self, model_path):

        self.model = joblib.load(model_path)
        self.encoder = EmbeddingGenerator()

    def predict(self, text):

        embedding = self.encoder.encode([text])
        prediction = self.model.predict(embedding)
        return prediction[0]
