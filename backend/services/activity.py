from core.database import get_user_client

def log_activity(token: str, user_id: str, topic_id: int, mode: str):
    client = get_user_client(token)
    return client.table("user_activity").insert({
        "user_id": user_id,
        "topic_id": topic_id,
        "mode": mode
    }).execute()

def get_user_activity(token: str, user_id: str, mode: str = None):
    client = get_user_client(token)
    query = client.table("user_activity").select(
        "id, user_id, topic_id, mode, visited_at, topics(name)"
    ).eq("user_id", user_id)

    if mode:
        query = query.eq("mode", mode)

    return query.order("visited_at", desc=True).execute()