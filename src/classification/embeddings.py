'''
USE: Provides a class to generate embeddings for complaint texts using a pre-trained SentenceTransformer model.
'''

from sentence_transformers import SentenceTransformer

class EmbeddingGenerator:

    def __init__(self):
        self.model = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")

    def encode(self, texts):
        return self.model.encode(texts)
