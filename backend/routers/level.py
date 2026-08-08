from fastapi import APIRouter, HTTPException, Request
from models.subject import SubjectInDB
import services.level as service
from models.response import APIResponse
from core.limiter import limiter
from core import settings

router = APIRouter(prefix="/levels", tags=["levels"])

@router.get("/{level_id}/subjects", response_model=APIResponse)
@limiter.limit(settings.rate_limit_default)
def get_subjects(request: Request, level_id: int):
    response = service.get_subjects_by_level(level_id)
    if not response.data:
        raise HTTPException(status_code=404, detail="Subject not found")
    subjects = [
        SubjectInDB(**row["subjects"], level_subject_id=row["id"])
        for row in response.data
    ]
    return APIResponse(data = subjects, status = 200)
