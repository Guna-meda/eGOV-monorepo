from fastapi import APIRouter

from src.api.schemas import (ComplaintRequest,)
from src.classification.inference import (CategoryInference,)
from src.classification.subcategory_labels import (assign_subcategory,)

router = APIRouter()
category_model = CategoryInference("models/category_classifier.pkl")


@router.post("/classify")
def classify(req: ComplaintRequest):

    category = category_model.predict(req.text)

    subcategory = assign_subcategory(
        req.text,
        category,
    )

    return {
        "complaint_id": req.complaint_id,
        "category": category,
        "subcategory": subcategory,
    }
