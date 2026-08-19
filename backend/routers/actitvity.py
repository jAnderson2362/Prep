from fastapi import APIRouter, HTTPException, Request, Depends
from models.activity import Activity
from models.response import APIResponse
from core.limiter import limiter
from core.auth import verify_token
from core import settings
import services.activity as service

router = APIRouter(prefix="/activity", tags=["activity"])

@router.post("", response_model=APIResponse)
@limiter.limit(settings.rate_limit_default)
def log_activity(request: Request, body: Activity, user=Depends(verify_token)):
    response = service.log_activity(
        token=request.state.token,
        user_id=user.id,
        topic_id=body.topic_id,
        mode=body.mode
    )
    return APIResponse(data=response.data, status=201)

@router.get("", response_model=APIResponse)
@limiter.limit(settings.rate_limit_default)
def get_activity(request: Request, mode: str = None, user=Depends(verify_token)):
    response = service.get_user_activity(
        token=request.state.token,
        user_id=user.id,
        mode=mode
    )
    return APIResponse(data=response.data, status=200)