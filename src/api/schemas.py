from pydantic import BaseModel


class ComplaintRequest(BaseModel):

    complaint_id: str
    text: str


class ClassificationResponse(BaseModel):

    complaint_id: str
    category: str
    subcategory: str
    #sentiment_class: str
    #sentiment_score: float
