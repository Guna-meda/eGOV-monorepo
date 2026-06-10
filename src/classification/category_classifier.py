'''
USE: Implements a category classifier that uses logistic regression to classify complaint texts into predefined categories based on their embeddings. The classifier can be trained, used for prediction, and saved/loaded from disk.

dependencies:
- sentence-transformers -> classification/embeddings.py 
'''

import joblib

from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report

from src.classification.embeddings import EmbeddingGenerator


class CategoryClassifier:

    def __init__(self):

        self.encoder = EmbeddingGenerator()

        self.model = LogisticRegression(max_iter=2000)

    def train(self, texts, labels):

        embeddings = self.encoder.encode(texts.tolist())

        X_train, X_test, y_train, y_test = train_test_split(
            embeddings,
            labels,
            test_size=0.2,
            random_state=42,
            stratify=labels,
        )

        self.model.fit(
            X_train,
            y_train,
        )

        preds = self.model.predict(X_test)

        print(
            classification_report(
                y_test,
                preds,
            )
        )

    def predict(self, texts):

        embeddings = self.encoder.encode(texts.tolist())

        return self.model.predict(embeddings)

    def save(self, path):

        joblib.dump(
            self.model,
            path,
        )

    def load(self, path):

        self.model = joblib.load(path)
