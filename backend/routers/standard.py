from fastapi import APIRouter, HTTPException, Request
import services.standard as service
from models.response import APIResponse
from core.limiter import limiter
from core import settings

router = APIRouter(prefix="/level-subjects", tags=["level-subjects"])

@router.get("/{level_subject_id}/standards", response_model=APIResponse)
@limiter.limit(settings.rate_limit_default)
def get_standards(request: Request, level_subject_id: int):
    response = service.get_standards_by_subject(level_subject_id)
    if not response.data:
        raise HTTPException(status_code=404, detail="Standard not found")
    return APIResponse(data = response.data, status = 200)