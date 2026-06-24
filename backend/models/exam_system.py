from pydantic import BaseModel

class ExamSystem(BaseModel):
    name: str
    country: str
    description: str

class ExamSystemInDB(ExamSystem):
    id: int