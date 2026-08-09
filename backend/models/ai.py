from pydantic import BaseModel, Field

class GeneratePracticeRequest(BaseModel):
    subject: str
    level: str
    topic: str
    difficulty: str
    question_count: int = Field(ge=1, le=10)
    optional_note: str | None = None

class PracticeQuestion(BaseModel):
    question: str
    answer: str
    explanation: str

class GenerateResponse(BaseModel):
    questions: list[PracticeQuestion]

class GenerateLearnRequest(BaseModel):
    subject: str
    level: str
    standard: str
    topic: str

class WorkedExample(BaseModel):
    problem: str
    steps: list[str]
    answer: str

class GenerateLearnResponse(BaseModel):
    title: str
    explanation: str
    worked_examples: list[WorkedExample]
    key_points: list[str]


