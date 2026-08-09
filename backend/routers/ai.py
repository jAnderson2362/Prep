from fastapi import APIRouter
from models.ai import GeneratePracticeRequest, GenerateResponse, GenerateLearnRequest, GenerateLearnResponse
from services.ai import generate_practice_questions, generate_learn_content

router = APIRouter(prefix="/ai", tags=["ai"])

@router.post("/generate-practice", response_model=GenerateResponse)
async def generate_practice(request: GeneratePracticeRequest):
    return generate_practice_questions(request)

@router.post("/generate-learn", response_model=GenerateLearnResponse)
async def generate_learn(request: GenerateLearnRequest):
    return generate_learn_content(request)

