from core.database import supabase

def get_standards_by_subject(level_subject_id: int):
    return supabase.table("standards").select("*").eq("level_subject_id", level_subject_id).execute()