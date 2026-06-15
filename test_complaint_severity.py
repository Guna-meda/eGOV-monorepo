"""
End-to-end complaint severity prediction pipeline.
Takes raw complaint text and predicts severity using:
1. Text cleaning & preprocessing
2. Classification model (category + subcategory)
3. Sentiment analysis
4. Severity prediction
"""

import sys
from pathlib import Path
import pandas as pd

# Add src to path for imports
sys.path.insert(0, str(Path(__file__).parent / "src"))

from preprocessing.text_cleaning import normalize_text
from classification.classifier import add_rule_labels
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


def get_complaint_input():
    """Get complaint text from user."""
    print("\nCOMPLAINT SEVERITY PREDICTOR\n")
    
    complaint_text = input("Enter complaint text: ").strip()
    
    if not complaint_text:
        print("Error: Please enter a complaint text")
        return None
    
    return complaint_text


def predict_complaint_severity(complaint_text: str, ward_density=10, geohash_density=5, category_geohash_density=3, ward_category_density=2, has_escalation=0, sla_hours=48) -> dict:
    """
    Full pipeline: Text -> Classification -> Sentiment -> Severity
    
    Args:
        complaint_text: Raw complaint text
        ward_density: Number of complaints in the ward
        geohash_density: Number of complaints in the geohash area
        category_geohash_density: Number of category complaints in geohash
        ward_category_density: Number of category complaints in ward
        has_escalation: Whether complaint has been escalated (0 or 1)
        sla_hours: Service level agreement hours
    
    Returns:
        Dictionary with full prediction pipeline results
    """
    
    results = {}
    
    # Step 1: Clean and normalize text
    print("\nProcessing complaint...")
    processed_text = normalize_text(complaint_text)
    results["original_text"] = complaint_text
    results["processed_text"] = processed_text
    
    # Step 2: Classify complaint
    print("  - Classifying complaint...")
    category = classifier_model.predict([processed_text])[0]
    category_prob = classifier_model.predict_proba([processed_text])
    category_confidence = max(category_prob[0])
    results["category"] = category
    results["category_confidence"] = round(category_confidence, 3)
    
    # Step 3: Sentiment analysis
    print("  - Analyzing sentiment...")
    sentiment_label, sentiment_score = score_sentiment(processed_text)
    results["sentiment_label"] = sentiment_label
    results["sentiment_score"] = sentiment_score
    
    # Step 4: Predict severity
    print("  - Predicting severity...")
    severity_result = predict_severity(
        category=category,
        subcategory="General",  # Default subcategory
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


def display_prediction_results(results: dict):
    """Display prediction results in a formatted way."""
    print("\n" + "="*70)
    print("PREDICTION RESULTS")
    print("="*70)
    
    print("\nInput:")
    print(f"  Original: {results['original_text']}")
    print(f"  Processed: {results['processed_text']}")
    
    print("\nClassification:")
    print(f"  Category: {results['category']}")
    print(f"  Confidence: {results['category_confidence']}")
    
    if SENTIMENT_AVAILABLE:
        print("\nSentiment Analysis:")
        print(f"  Sentiment: {results['sentiment_label']}")
        print(f"  Score: {results['sentiment_score']}")
    
    print("\nSeverity Prediction:")
    print(f"  Score: {results['severity_score']} (0-1 scale)")
    print(f"  Label: {results['severity_label']}")
    
    # Status indicator
    label = results['severity_label']
    if label == "CRITICAL":
        print("  Status: CRITICAL - Immediate action required!")
    elif label == "HIGH":
        print("  Status: HIGH - Urgent attention needed")
    elif label == "MEDIUM":
        print("  Status: MEDIUM - Standard processing")
    else:
        print("  Status: LOW - Can be scheduled")
    
    print("="*70 + "\n")


def main():
    """Main interactive loop."""
    print("\nWelcome to the Complaint Severity Predictor!")
    print("This tool takes complaint text and predicts severity using ML models.")
    
    while True:
        complaint_text = get_complaint_input()
        
        if complaint_text is None:
            print("Retrying...\n")
            continue
        
        try:
            results = predict_complaint_severity(complaint_text)
            display_prediction_results(results)
        except Exception as e:
            print(f"Error during prediction: {e}")
            import traceback
            traceback.print_exc()
        
        # Ask if user wants to test again
        while True:
            choice = input("Do you want to test another complaint? (yes/no): ").strip().lower()
            if choice in ['yes', 'y']:
                break
            elif choice in ['no', 'n']:
                print("\nThank you for using the Complaint Severity Predictor! Goodbye!")
                return
            else:
                print("Please enter 'yes' or 'no'")


if __name__ == "__main__":
    main()
