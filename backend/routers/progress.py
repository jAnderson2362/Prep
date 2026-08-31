import os
from dotenv import load_dotenv
from supabase import create_client, Client

from fastapi import APIRouter
from models.progress import ProgressCreate
from models.response import APIResponse

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