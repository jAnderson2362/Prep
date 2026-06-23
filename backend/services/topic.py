from core.database import supabase

def get_topics_by_standard(standard_id: int):
    return supabase.table("topics").select("*").eq("standard_id", standard_id).execute()