from core.database import supabase

def get_subjects_by_level(level_id: int):
    return supabase.table("level_subjects").select("*, subjects(*)").eq("level_id", level_id).execute()