"""
Interactive test script for the CatBoost severity model.
Allows users to input data and test the severity prediction model.
"""

import sys
from pathlib import Path

# Add src to path for imports
sys.path.insert(0, str(Path(__file__).parent / "src"))

from severity.severity_engine import predict_severity


def get_user_input():
    """Get test inputs from user."""
    print("\nSEVERITY MODEL TESTER")
    
    try:
        # String inputs
        category = input("\nEnter category (e.g., 'Roads', 'Water Supply'): ").strip()
        subcategory = input("Enter subcategory (e.g., 'Pothole', 'Leakage'): ").strip()
        
        # Float inputs
        category_confidence = float(input("\nEnter category confidence (0-1): "))
        sla_hours = float(input("Enter SLA hours (e.g., 24, 48): "))
        
        # Integer inputs
        ward_complaint_density = int(input("\nEnter ward complaint density (count): "))
        category_geohash_density = int(input("Enter category geohash density (count): "))
        geohash_density = int(input("Enter geohash density (count): "))
        ward_category_density = int(input("Enter ward category density (count): "))
        has_escalation = int(input("\nHas escalation? (0 for No, 1 for Yes): "))
        
        if category_confidence < 0 or category_confidence > 1:
            print("Warning: category_confidence should be between 0 and 1")
        
        if has_escalation not in [0, 1]:
            print("Warning: has_escalation should be 0 or 1")
        
        return {
            "category": category,
            "subcategory": subcategory,
            "category_confidence": category_confidence,
            "ward_complaint_density": ward_complaint_density,
            "category_geohash_density": category_geohash_density,
            "geohash_density": geohash_density,
            "ward_category_density": ward_category_density,
            "has_escalation": has_escalation,
            "sla_hours": sla_hours,
        }
    
    except ValueError as e:
        print(f"Error: Invalid input - {e}")
        return None


def display_results(input_data, result):
    """Display the prediction results."""
    print("\nPREDICTION RESULTS")
    
    print("\nInput Data:")
    print(f"  Category: {input_data['category']}")
    print(f"  Subcategory: {input_data['subcategory']}")
    print(f"  Category Confidence: {input_data['category_confidence']}")
    print(f"  Ward Complaint Density: {input_data['ward_complaint_density']}")
    print(f"  Category Geohash Density: {input_data['category_geohash_density']}")
    print(f"  Geohash Density: {input_data['geohash_density']}")
    print(f"  Ward Category Density: {input_data['ward_category_density']}")
    print(f"  Has Escalation: {input_data['has_escalation']}")
    print(f"  SLA Hours: {input_data['sla_hours']}")
    
    print("\nModel Prediction:")
    print(f"  Severity Score: {result['severity_score']} (0-1 scale)")
    print(f"  Severity Label: {result['severity_label']}")
    
    # Severity status
    label = result['severity_label']
    if label == "CRITICAL":
        print("  Status: CRITICAL - Immediate action required!")
    elif label == "HIGH":
        print("  Status: HIGH - Urgent attention needed")
    elif label == "MEDIUM":
        print("  Status: MEDIUM - Standard processing")
    else:
        print("  Status: LOW - Can be scheduled")
    
    print()


def main():
    """Main test loop."""
    print("\nWelcome to the Severity Model Tester!")
    print("This tool allows you to test the CatBoost severity prediction model.")
    
    while True:
        input_data = get_user_input()
        
        if input_data is None:
            print("Retrying...\n")
            continue
        
        try:
            result = predict_severity(**input_data)
            display_results(input_data, result)
        except Exception as e:
            print(f"Error during prediction: {e}")
            import traceback
            traceback.print_exc()
        
        # Ask if user wants to test again
        while True:
            choice = input("Do you want to test again? (yes/no): ").strip().lower()
            if choice in ['yes', 'y']:
                break
            elif choice in ['no', 'n']:
                print("\n✅ Thank you for testing! Goodbye!")
                return
            else:
                print("Please enter 'yes' or 'no'")
        
        print("\nThank you for testing! Goodbye!")
        return


if __name__ == "__main__":
    main()
