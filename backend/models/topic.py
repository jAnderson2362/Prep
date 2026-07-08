from pydantic import BaseModel

class Topic(BaseModel):
    name: str
    standard_id: int

class TopicInDB(Topic):
    id: int