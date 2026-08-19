from datetime import datetime
from pydantic import BaseModel

class Acitvity(BaseModel):
    topic_id: int
    mode: str

class ActivityInDB(Acitvity):
    id: int
    user_id: str
    visited_at: datetime