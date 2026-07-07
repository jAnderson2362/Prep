from pydantic import BaseModel

class Subject(BaseModel):
    name: str

class SubjectInDB(Subject):
    id: int