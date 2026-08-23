from core.database import supabase

def log_activity(user_id: str, topic_id: int, mode: str):
    return supabase.table("user_activity").insert({
        "user_id": user_id,
        "topic_id": topic_id,
        "mode": mode
    }).execute()

def get_user_activity(user_id: str, mode: str = None,
                      standard_id: int = None, level_subject_id: int = None):
    if level_subject_id:
        select = "id, user_id, topic_id, mode, visited_at, topics!inner(name, standards!inner(level_subject_id))"
    elif standard_id:
        select = "id, user_id, topic_id, mode, visited_at, topics!inner(name, standard_id)"
    else:
        select = "id, user_id, topic_id, mode, visited_at, topics(name)"

    query = supabase.table("user_activity").select(select).eq("user_id", user_id)

    if mode:
        query = query.eq("mode", mode)
    if standard_id:
        query = query.eq("topics.standard_id", standard_id)
    if level_subject_id:
        query = query.eq("topics.standards.level_subject_id", level_subject_id)

    return query.order("visited_at", desc=True).execute()