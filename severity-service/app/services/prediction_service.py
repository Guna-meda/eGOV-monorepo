from app.model_loader import ModelLoader
from app.services.feature_engineering import FeatureEngineering


class PredictionService:

    @staticmethod
    def get_severity_label(score: float) -> str:

        if score < 3:
            return "LOW"

        elif score < 6:
            return "MEDIUM"

        elif score < 8:
            return "HIGH"

        else:
            return "CRITICAL"

    @staticmethod
    def predict(request):

        # ---------------------------------------------
        # Generate Sentence Transformer Embedding
        # ---------------------------------------------

        features = FeatureEngineering.build_features(request)

        # ---------------------------------------------
        # Load CatBoost Model
        # ---------------------------------------------

        model = ModelLoader.get_model()

        # ---------------------------------------------
        # Predict Severity
        # ---------------------------------------------

        prediction = model.predict(features)

        severity_score = float(prediction[0])

        # ---------------------------------------------
        # Clamp between 0 and 10
        # ---------------------------------------------

        severity_score = max(0.0, min(severity_score, 10.0))

        severity_score = round(severity_score, 2)

        # ---------------------------------------------
        # Convert score to label
        # ---------------------------------------------

        severity_label = PredictionService.get_severity_label(
            severity_score
        )

        # ---------------------------------------------
        # Response
        # ---------------------------------------------

        return {
            "complaint_id": request.complaint_id,
            "severity_score": severity_score,
            "severity_label": severity_label
        }