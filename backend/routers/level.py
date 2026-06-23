from fastapi import APIRouter, HTTPException
import services.level as service

router = APIRouter(prefix="/levels", tags=["levels"])

@router.get("/{level_id}/subjects",)
def get_subjects(level_id: int):
    response = service.get_subjects_by_level(level_id)
    if not response.data:
        raise HTTPException(status_code=404, detail="Subject not found")
    return response.data
