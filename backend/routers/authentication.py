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
    
class UpdateProfile(BaseModel):
    display_name: str


@router.post("/sign_up")
@limiter.limit(settings.rate_limit_default)
def sign_up(request: Request, user: UserAuth):
    global current_user, current_session

    try:
        response = supabase.auth.sign_up({
            "email": user.email,
            "password": user.password
        })

        current_user = response.user
        current_session = response.session

        print("User registered:", current_user.email)

        return {
            "email": response.user.email,
            "created_at": response.user.created_at
        }

    except Exception as e:
        return {"error": str(e)}
    
current_user = None

@router.post("/sign_in")
@limiter.limit(settings.rate_limit_default)
def sign_in(request: Request, user: UserAuth):
    global current_user, current_session
    current_user = None

    try:
        response = supabase.auth.sign_in_with_password({
            "email": user.email,
            "password": user.password
        })

        current_user = response.user
        current_session = response.session

        print("User signed in:", current_user.email)
        
        return {
            "email": response.user.email,
            "created_at": response.user.created_at,
            "session": {
                "access_token": response.session.access_token
        }
    }
    except Exception as e:

        return {"error": str(e)}

@router.post("/sign_out")
@limiter.limit(settings.rate_limit_default)
def sign_out(request: Request):


    response = supabase.auth.sign_out()

    return {"message": "Account has signed out"}

@router.get("/profile")
def get_profile():
  
  global current_user

  print("Current user:", current_user)

  if current_user is None:
    return {"error": "User is not signed in"}

  return {
    "email": current_user.email,
    "created_at": current_user.created_at,
    "display_name": current_user.user_metadata.get("display_name", "")
  }

@router.post("/update_profile")
def update_profile(profile: UpdateProfile):

    try:
        print("Current session:", current_session)
        print("Display name received:", profile.display_name)

        response = supabase.auth.update_user({
            "data": {
                "display_name": profile.display_name
            }
        })

        print("Update response:", response)

        return {"message": "Profile updated"}

    except Exception as e:
        print("ERROR TYPE:", type(e))
        print("ERROR:", str(e))
        return {"error": str(e)}