from datetime import datetime
from pydantic import BaseModel

class ProgressCreate(BaseModel):
    user_id: str
    topic_id: int
    score: int
    total_questions: int

class Progress(BaseModel):
    user_id: str
    topic_id: int
    score: int
    total_questions: int
    attempted_at: datetime

class ProgressInDB(Progress):
    id: int
    