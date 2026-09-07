import os
from dotenv import load_dotenv
from supabase import create_client, Client

from models.progress import ProgressCreate
from models.response import APIResponse
from fastapi import APIRouter, Request, Depends
from core.limiter import limiter
from core.auth import verify_token
from core import settings
import services.progress as service

load_dotenv()

url: str = os.getenv("SUPABASE_URL")
key: str = os.getenv("SUPABASE_KEY")

supabase: Client = create_client(url, key)

router = APIRouter(
    prefix="/progress",
    tags=["progress"]
)

@router.post("/")
def create_progress(progress: ProgressCreate):

    try:
        result = supabase.table("progress").insert({
            "user_id": progress.user_id,
            "topic_id": progress.topic_id,
            "score": progress.score,
            "total_questions": progress.total_questions
        }).execute()

        return APIResponse(
            data=result.data,
            error=None,
            status=200
        )

    except Exception as e:
        return APIResponse(
            data=None,
            error=str(e),
            status=500
        )

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
