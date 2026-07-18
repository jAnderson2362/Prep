from fastapi import APIRouter
from backend.models.ai import GeneratePracticeRequest, PracticeQuestionResponse
from backend.services.ai import generate_practice_questions

router = APIRouter(prefic="/ai", tags=["ai"])

@router.post("/generate-practice", response_model=PracticeQuestionResponse)
async def generate_practice(request: GeneratePracticeRequest):
    return generate_practice_questions(request)

