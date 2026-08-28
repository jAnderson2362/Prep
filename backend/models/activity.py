from datetime import datetime
from pydantic import BaseModel

class Activity(BaseModel):
    topic_id: int
    mode: str

class ActivityInDB(Activity):
    id: int
    user_id: str
    visited_at: datetime