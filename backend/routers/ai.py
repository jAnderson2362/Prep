from fastapi import APIRouter, Depends
from models.ai import GeneratePracticeRequest, GenerateResponse, GenerateLearnRequest, GenerateLearnResponse, GenerateExamRequest, GenerateExamResponse
from services.ai import generate_practice_questions, generate_learn_content, generate_exam_questions
from core.auth import verify_token

router = APIRouter(prefix="/ai", tags=["ai"])

@router.post("/generate-practice", response_model=GenerateResponse)
async def generate_practice(request: GeneratePracticeRequest, user = Depends(verify_token)):
    return generate_practice_questions(request)

@router.post("/generate-learn", response_model=GenerateLearnResponse)
async def generate_learn(request: GenerateLearnRequest, user = Depends(verify_token)):
    return generate_learn_content(request)

@router.post("/generate-exam", response_model=GenerateExamResponse)
async def generate_exam(request: GenerateExamRequest, user = Depends(verify_token)):
    return generate_exam_questions(request)
