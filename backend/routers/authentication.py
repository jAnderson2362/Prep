import os
from supabase import create_client, Client
from fastapi import APIRouter
from dotenv import load_dotenv
from pydantic import BaseModel

load_dotenv()
router = APIRouter(prefix="/auth", tags=["authentication"])
url: str = os.getenv("SUPABASE_URL")
key: str = os.getenv("SUPABASE_KEY")
supabase: Client = create_client(url, key)

class UserAuth(BaseModel):
    email: str
    password: str

@router.post("/sign_up")
def sign_up(user: UserAuth):

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
def sign_in(user: UserAuth):
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
def sign_out():
    response = supabase.auth.sign_out()

    return {"message": "Account has signed out"}
