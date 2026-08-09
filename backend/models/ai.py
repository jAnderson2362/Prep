from pydantic import BaseModel, Field

class GeneratePracticeRequest(BaseModel):
    subject: str
    level: str
    topic: str
    difficulty: str
    question_count: int = Field(ge=1, le=10)
    optional_note: str | None = None

class QuizOption(BaseModel):
    id: str
    text: str

class PracticeQuestion(BaseModel):
    question: str
    options: list[QuizOption] = Field(min_length=4, max_length=4)
    correct_option_id: str
    explanation: str

class GenerateResponse(BaseModel):
    questions: list[PracticeQuestion]

