"""
Test script with pre-configured test cases for the severity model.
Run this to quickly test the model with sample data.
"""

import sys
from pathlib import Path

# Add src to path for imports
sys.path.insert(0, str(Path(__file__).parent / "src"))

from severity.severity_engine import predict_severity


def test_severity_model():
    """Test severity model with predefined test cases."""
    
    test_cases = [
        {
            "name": "Low Severity - Routine Maintenance",
            "data": {
                "category": "Roads",
                "subcategory": "Street Light",
                "category_confidence": 0.92,
                "ward_complaint_density": 2,
                "category_geohash_density": 1,
                "geohash_density": 3,
                "ward_category_density": 1,
                "has_escalation": 0,
                "sla_hours": 72,
            }
        },
        {
            "name": "Medium Severity - Water Issue",
            "data": {
                "category": "Water Supply",
                "subcategory": "Leakage",
                "category_confidence": 0.85,
                "ward_complaint_density": 15,
                "category_geohash_density": 5,
                "geohash_density": 8,
                "ward_category_density": 3,
                "has_escalation": 0,
                "sla_hours": 48,
            }
        },
        {
            "name": "High Severity - Major Pothole",
            "data": {
                "category": "Roads",
                "subcategory": "Pothole",
                "category_confidence": 0.95,
                "ward_complaint_density": 25,
                "category_geohash_density": 12,
                "geohash_density": 20,
                "ward_category_density": 8,
                "has_escalation": 1,
                "sla_hours": 24,
            }
        },
        {
            "name": "Critical Severity - Multiple Escalations",
            "data": {
                "category": "Water Supply",
                "subcategory": "Pipeline Break",
                "category_confidence": 0.98,
                "ward_complaint_density": 50,
                "category_geohash_density": 35,
                "geohash_density": 45,
                "ward_category_density": 20,
                "has_escalation": 1,
                "sla_hours": 2,
            }
        },
    ]
    
    print("\nSEVERITY MODEL - PREDEFINED TEST CASES\n")
    
    for i, test in enumerate(test_cases, 1):
        print(f"Test Case {i}: {test['name']}")
        
        try:
            result = predict_severity(**test["data"])
            
            print(f"  Severity Score: {result['severity_score']}")
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
            
            # Display input summary
            data = test["data"]
            print(f"\n  Input Summary:")
            print(f"    • Category: {data['category']}")
            print(f"    • Subcategory: {data['subcategory']}")
            print(f"    • Confidence: {data['category_confidence']}")
            print(f"    • Ward Density: {data['ward_complaint_density']}")
            print(f"    • Escalated: {'Yes' if data['has_escalation'] else 'No'}")
            print(f"    • SLA: {data['sla_hours']} hours")
            
        except Exception as e:
            print(f"  Error: {e}")
            import traceback
            traceback.print_exc()
        
        print()
    
    print("Test run completed!")


if __name__ == "__main__":
    test_severity_model()
