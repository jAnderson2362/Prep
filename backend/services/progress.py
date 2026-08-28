from core.database import supabase

def save_progress(user_id: str, topic_id: int, score: int, total_questions: int):
    return supabase.table("progress").insert({
        "user_id": user_id,
        "topic_id": topic_id,
        "score": score,
        "total_questions": total_questions
    }).execute()