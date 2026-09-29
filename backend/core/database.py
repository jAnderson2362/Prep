from supabase import create_client, Client
from .config import settings

supabase: Client = create_client(settings.supabase_url, settings.supabase_key)

# Bypasses RLS. Only use for tables clients must never read directly (questions).
supabase_admin: Client | None = (
    create_client(settings.supabase_url, settings.supabase_service_key)
    if settings.supabase_service_key
    else None
)
