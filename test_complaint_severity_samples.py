"""
Test script with sample complaints for the end-to-end severity predictor.
Run this to quickly test the full pipeline with various complaint types.
"""

import sys
from pathlib import Path
import pandas as pd

# Add src to path for imports
sys.path.insert(0, str(Path(__file__).parent / "src"))

from preprocessing.text_cleaning import normalize_text
from severity.severity_engine import predict_severity
import joblib

# Try to load sentiment model, but it's optional
try:
    from sentiment.sentiment import score_sentiment
    SENTIMENT_AVAILABLE = True
except ImportError:
    SENTIMENT_AVAILABLE = False
    def score_sentiment(text):
        return "neutral", 0.0

# Load the classification model
MODEL_PATH = Path(__file__).parent / "models" / "category_classifier" / "tfidf_logreg.joblib"
classifier_model = joblib.load(MODEL_PATH)


def predict_complaint_severity(complaint_text: str, ward_density=10, geohash_density=5, category_geohash_density=3, ward_category_density=2, has_escalation=0, sla_hours=48) -> dict:
    """
    Full pipeline: Text -> Classification -> Sentiment -> Severity
    """
    
    results = {}
    
    # Step 1: Clean and normalize text
    processed_text = normalize_text(complaint_text)
    results["original_text"] = complaint_text
    results["processed_text"] = processed_text
    
    # Step 2: Classify complaint
    category = classifier_model.predict([processed_text])[0]
    category_prob = classifier_model.predict_proba([processed_text])
    category_confidence = max(category_prob[0])
    results["category"] = category
    results["category_confidence"] = round(category_confidence, 3)
    
    # Step 3: Sentiment analysis
    sentiment_label, sentiment_score = score_sentiment(processed_text)
    results["sentiment_label"] = sentiment_label
    results["sentiment_score"] = sentiment_score
    
    # Step 4: Predict severity
    severity_result = predict_severity(
        category=category,
        subcategory="General",
        category_confidence=category_confidence,
        ward_complaint_density=ward_density,
        category_geohash_density=category_geohash_density,
        geohash_density=geohash_density,
        ward_category_density=ward_category_density,
        has_escalation=has_escalation,
        sla_hours=sla_hours
    )
    
    results["severity_score"] = severity_result["severity_score"]
    results["severity_label"] = severity_result["severity_label"]
    
    return results


def test_sample_complaints():
    """Test with predefined sample complaints."""
    
    test_cases = [
        {
            "name": "Street Light Issue",
            "complaint": "Street light near our house is not working for 3 days",
            "ward_density": 5,
            "category_geohash_density": 2,
            "has_escalation": 0
        },
        {
            "name": "Pothole on Road",
            "complaint": "There is a huge pothole on the main road causing accidents",
            "ward_density": 25,
            "category_geohash_density": 12,
            "has_escalation": 1
        },
        {
            "name": "Water Leak",
            "complaint": "Water is leaking from the main supply line affecting multiple houses",
            "ward_density": 30,
            "category_geohash_density": 18,
            "has_escalation": 1
        },
        {
            "name": "Garbage Not Collected",
            "complaint": "Garbage has not been collected from our area for a week",
            "ward_density": 8,
            "category_geohash_density": 3,
            "has_escalation": 0
        },
        {
            "name": "Drainage Problem",
            "complaint": "Drain is clogged and causing water stagnation, mosquitoes everywhere",
            "ward_density": 15,
            "category_geohash_density": 7,
            "has_escalation": 0
        },
    ]
    
    print("\nCOMPLAINT SEVERITY PREDICTION - SAMPLE TEST\n")
    
    for i, test in enumerate(test_cases, 1):
        print(f"Test Case {i}: {test['name']}")
        
        try:
            results = predict_complaint_severity(
                test["complaint"],
                ward_density=test.get("ward_density", 10),
                category_geohash_density=test.get("category_geohash_density", 3),
                has_escalation=test.get("has_escalation", 0)
            )
            
            print(f"  Complaint: {results['original_text']}")
            print(f"  Category: {results['category']} (confidence: {results['category_confidence']})")
            if SENTIMENT_AVAILABLE:
                print(f"  Sentiment: {results['sentiment_label']} (score: {results['sentiment_score']})")
            print(f"  Severity Score: {results['severity_score']}")
            print(f"  Severity Label: {results['severity_label']}")
            
            # Status
            label = results['severity_label']
            if label == "CRITICAL":
                print("  Status: CRITICAL - Immediate action required!")
            elif label == "HIGH":
                print("  Status: HIGH - Urgent attention needed")
            elif label == "MEDIUM":
                print("  Status: MEDIUM - Standard processing")
            else:
                print("  Status: LOW - Can be scheduled")
            
        except Exception as e:
            print(f"  Error: {e}")
            import traceback
            traceback.print_exc()
        
        print()
    
    print("Test run completed!")


if __name__ == "__main__":
    test_sample_complaints()
