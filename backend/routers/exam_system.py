from fastapi import APIRouter, HTTPException
import services.exam_system as service
from models.response import APIResponse

router = APIRouter(prefix="/exam-systems", tags=["exam-systems"])

@router.get("/", response_model=APIResponse)
def get_all():
    response = service.get_all_exam_systems()
    return APIResponse(data = response.data, status = 200)

@router.get("/{exam_system_id}/levels", response_model=APIResponse)
def get_levels(exam_system_id: int):
    response = service.get_levels_by_exam_system(exam_system_id)
    if not response.data:
        raise HTTPException(status_code=404, detail="Level not found")
    return APIResponse(data = response.data, status = 200)