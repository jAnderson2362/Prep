from fastapi import APIRouter, HTTPException
import services.exam_system as service

router = APIRouter(prefix="/exam-systems", tags=["exam-systems"])

@router.get("/",)
def get_all():
    response = service.get_all_exam_systems()
    return response.data

@router.get("/{exam_system_id}/levels",)
def get_levels(exam_system_id: int):
    response = service.get_levels_by_exam_system(exam_system_id)
    if not response.data:
        raise HTTPException(status_code=404, detail="Level not found")
    return response.data