from pydantic import BaseModel

class Standard(BaseModel):
    name: str
    level_subject_id: int

class StandardInDB(Standard):
    id: int