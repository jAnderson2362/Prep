from supabase import create_client, Client
from .config import settings

supabase: Client = create_client(settings.supabase_url, settings.supabase_key)

def get_user_client(token: str) -> Client:
    client = create_client(settings.supabase_url, settings.supabase_key)
    client.postgrest.auth(token)
    return client