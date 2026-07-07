from core.database import supabase

def get_all_exam_systems():
    return supabase.table("exam_systems").select("*").execute()

def get_levels_by_exam_system(exam_system_id: int):
    return supabase.table("levels").select("*").eq("exam_system_id", exam_system_id).execute()