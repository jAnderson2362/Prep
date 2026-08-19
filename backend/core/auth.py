from fastapi import Request, HTTPException
from supabase import create_client, Client
import os

url: str = os.getenv("SUPABASE_URL")
key: str = os.getenv("SUPABASE_KEY")
supabase: Client = create_client(url, key)


def verify_token(request: Request):
    # 1. Read the Authorization header
    auth_header = request.headers.get("Authorization")

    if not auth_header:
        raise HTTPException(status_code=401, detail="No authorization token provided")

    # 2. Strip the "Bearer " prefix to get the raw token
    #    Header looks like: "Bearer eyJhbGciOi..."
    token = auth_header.replace("Bearer ", "")

    # 3. Ask Supabase if this token is real
    try:
        user_response = supabase.auth.get_user(token)
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    # 4. If Supabase didn't return a user, the token is not valid
    if not user_response or not user_response.user:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    request.state.token = token
    return user_response.user

    # Token is valid so return the user so endpoints can use it if they want
    return user_response.user