from core.database import supabase

def save_progress(user_id: str, topic_id: int, score: int, total_questions: int, token: str):
    supabase.postgrest.auth(token)

    return supabase.table("progress").insert({
        "user_id": user_id,
        "topic_id": topic_id,
        "score": score,
        "total_questions": total_questions
    }).execute()

def get_progress(user_id: str, token: str):
    supabase.postgrest.auth(token)

    return supabase.table("progress").select(
        "topic_id, score, total_questions, attempted_at"
    ).eq("user_id", user_id).execute()