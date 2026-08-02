from datetime import datetime
from pydantic import BaseModel

class Progress(BaseModel):
    user_id: str
    topic_id: int
    progress: float
    last_updated: datetime
class ProgressInDB(Progress):
    id: int