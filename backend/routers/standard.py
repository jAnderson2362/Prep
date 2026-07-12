from fastapi import APIRouter, HTTPException
import services.standard as service
from models.response import APIResponse

router = APIRouter(prefix="/level-subjects", tags=["level-subjects"])

@router.get("/{level_subject_id}/standards", response_model=APIResponse)
def get_standards(level_subject_id: int):
    response = service.get_standards_by_subject(level_subject_id)
    if not response.data:
        raise HTTPException(status_code=404, detail="Standard not found")
    return APIResponse(data = response.data, status = 200)