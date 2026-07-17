import numpy as np
from scipy.sparse import hstack

from app.model_loader import ModelLoader
from app.services.preprocessing import TextPreprocessor
from app.utils.danger_words import get_danger_score


class FeatureEngineering:

    STATUS_MAP = {
        "OPEN": 3,
        "PENDING": 2,
        "IN_PROGRESS": 2,
        "RESOLVED": 0,
        "CLOSED": 0
    }

    @staticmethod
    def build_features(request):

        # --------------------------------------------------
        # Clean Complaint Text
        # --------------------------------------------------

        clean_text = TextPreprocessor.clean(
            request.description
        )

        # --------------------------------------------------
        # Load TF-IDF
        # --------------------------------------------------

        vectorizer = ModelLoader.get_vectorizer()

        text_features = vectorizer.transform(
            [clean_text]
        )

        # --------------------------------------------------
        # Text Features
        # --------------------------------------------------

        danger_score = get_danger_score(clean_text)

        char_length = TextPreprocessor.character_count(
            clean_text
        )

        word_count = TextPreprocessor.word_count(
            clean_text
        )

        # --------------------------------------------------
        # Load Normalization Values
        # --------------------------------------------------

        normalization = ModelLoader.get_normalization()

        max_sla = normalization["max_sla"]

        max_escalation = normalization["max_escalation"]

        # --------------------------------------------------
        # SLA Score
        # --------------------------------------------------

        try:
            sla_score = float(request.sla_hours) / max_sla

        except:

            sla_score = 0

        sla_score = min(
            max(sla_score, 0),
            1
        )

        # --------------------------------------------------
        # Escalation Score
        # --------------------------------------------------

        try:

            escalation_score = (
                float(request.escalation_level)
                /
                max_escalation
            )

        except:

            escalation_score = 0

        escalation_score = min(
            max(escalation_score, 0),
            1
        )

        # --------------------------------------------------
        # Status Score
        # --------------------------------------------------

        status_score = self_status = (
            FeatureEngineering.STATUS_MAP.get(
                request.status.upper(),
                1
            )
        )

        # --------------------------------------------------
        # Metadata
        # --------------------------------------------------

        metadata = np.array([[
            danger_score,
            char_length,
            word_count,
            sla_score,
            escalation_score,
            status_score
        ]])

        # --------------------------------------------------
        # Final Feature Vector
        # --------------------------------------------------

        final_features = hstack([
            text_features,
            metadata
        ])

        return final_features