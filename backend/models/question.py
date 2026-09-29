from typing import Literal
from pydantic import BaseModel

GradeBand = Literal["achieved", "merit", "excellence"]

class Marking(BaseModel):
    answer_type: str
    answer: list[str]
    model_answer: str
    explanation: str
    working: list[str] = []
    generator: dict | None = None

class QuestionCreate(BaseModel):
    standard: str
    skill: str
    grade_band: GradeBand
    source: Literal["generator", "authored"]
    prompt: str
    marking: Marking
    active: bool = True

class QuestionInDB(QuestionCreate):
    id: int
