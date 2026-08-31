from datetime import datetime
from pydantic import BaseModel

class ResultCreate(BaseModel):
    user_id: str
    topic_id: int
    mode: str
    score: float
    total_questions: int

class ResultResponse(ResultCreate):
    id: int
    created_at: datetime