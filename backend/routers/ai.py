from fastapi import APIRouter
from models.ai import GeneratePracticeRequest, GenerateResponse
from services.ai import generate_practice_questions

router = APIRouter(prefix="/ai", tags=["ai"])

@router.post("/generate-practice", response_model=GenerateResponse)
async def generate_practice(request: GeneratePracticeRequest):
    return generate_practice_questions(request)

