from fastapi import APIRouter, Request, Depends
from models.progress import Progress
from models.response import APIResponse
from core.limiter import limiter
from core.auth import verify_token
from core import settings
import services.progress as service

router = APIRouter(prefix="/progress", tags=["progress"])

@router.post("", response_model=APIResponse)
@limiter.limit(settings.rate_limit_default)
def save_progress(request: Request, body: Progress, user=Depends(verify_token)):
    response = service.save_progress(
        user_id=user.id,
        topic_id=body.topic_id,
        score=body.score,
        total_questions=body.total_questions
    )
    return APIResponse(data=response.data, status=201)