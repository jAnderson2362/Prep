from fastapi import APIRouter, HTTPException
from models.subject import SubjectInDB
import services.level as service

router = APIRouter(prefix="/levels", tags=["levels"])

@router.get("/{level_id}/subjects", response_model=list[SubjectInDB])
def get_subjects(level_id: int):
    response = service.get_subjects_by_level(level_id)
    if not response.data:
        raise HTTPException(status_code=404, detail="Subject not found")
    return [SubjectInDB(**row["subjects"]) for row in response.data]
