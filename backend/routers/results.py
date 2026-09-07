import os
from typing import Optional

from dotenv import load_dotenv
from supabase import create_client, Client

from fastapi import APIRouter
from models.result import ResultCreate
from models.response import APIResponse

load_dotenv()

url: str = os.getenv("SUPABASE_URL")
key: str = os.getenv("SUPABASE_KEY")

supabase: Client = create_client(url, key)

router = APIRouter(
    prefix="/results",
    tags=["results"]
)

@router.post("/")
def save_result(result: ResultCreate):

    try:
        response = supabase.table("results").insert({
            "user_id": result.user_id,
            "topic_id": result.topic_id,
            "mode": result.mode,
            "score": result.score,
            "total_questions": result.total_questions
        }).execute()

        return APIResponse(
            data=response.data,
            error=None,
            status=200
        )

    except Exception as e:
        return APIResponse(
            data=None,
            error=str(e),
            status=500
        )


@router.get("/")
def get_results(
    user_id: Optional[str] = None,
    topic_id: Optional[int] = None,
    mode: Optional[str] = None
):

    try:
        query = supabase.table("results").select("*")

        if user_id:
            query = query.eq("user_id", user_id)

        if topic_id:
            query = query.eq("topic_id", topic_id)

        if mode:
            query = query.eq("mode", mode)

        response = query.execute()

        return APIResponse(
            data=response.data,
            error=None,
            status=200
        )

    except Exception as e:
        return APIResponse(
            data=None,
            error=str(e),
            status=500
        )

@router.get("/stats")
def get_stats(user_id: str):

    try:
        response = (
            supabase
            .table("results")
            .select("*")
            .eq("user_id", user_id)
            .execute()
        )

        results = response.data

        if not results:
            return APIResponse(
                data=[],
                error=None,
                status=200
            )

        stats = {}

        for result in results:
            topic_id = result["topic_id"]

            if topic_id not in stats:
                stats[topic_id] = {
                    "topic_id": topic_id,
                    "total_attempts": 0,
                    "total_score": 0
                }

            stats[topic_id]["total_attempts"] += 1
            stats[topic_id]["total_score"] += result["score"]

        output = []

        for topic in stats.values():
            output.append({
                "topic_id": topic["topic_id"],
                "total_attempts": topic["total_attempts"],
                "average_score":
                    topic["total_score"] / topic["total_attempts"]
            })

        return APIResponse(
            data=output,
            error=None,
            status=200
        )

    except Exception as e:
        return APIResponse(
            data=None,
            error=str(e),
            status=500
        )