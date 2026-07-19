import os
from supabase import create_client, Client
from fastapi import APIRouter, Request
from dotenv import load_dotenv
from pydantic import BaseModel
from core.limiter import limiter
from core import settings

load_dotenv()
router = APIRouter(prefix="/auth", tags=["authentication"])
url: str = os.getenv("SUPABASE_URL")
key: str = os.getenv("SUPABASE_KEY")
supabase: Client = create_client(url, key)

class UserAuth(BaseModel):
    email: str
    password: str

@router.post("/sign_up")
@limiter.limit(settings.rate_limit_default)
def sign_up(request: Request, user: UserAuth):

    try: 
        response = supabase.auth.sign_up({
            "email": user.email,
            "password": user.password
        })
        print(response)
        return {"message": "Account has been created"}
    except Exception as e:
  
        return {"error": str(e)}

@router.post("/sign_in")
@limiter.limit(settings.rate_limit_default)
def sign_in(request: Request, user: UserAuth):
    try:
        response = supabase.auth.sign_in_with_password({
            "email": user.email,
            "password": user.password
        })
        print(response) 
        return response 
    except Exception as e:

        return {"error": str(e)}

@router.post("/sign_out")
@limiter.limit(settings.rate_limit_default)
def sign_out(request: Request):
    response = supabase.auth.sign_out()

    return {"message": "Account has signed out"}
