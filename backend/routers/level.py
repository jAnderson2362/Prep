from fastapi import APIRouter, HTTPException
from models.subject import SubjectInDB
import services.level as service
from models.response import APIResponse

router = APIRouter(prefix="/levels", tags=["levels"])

@router.get("/{level_id}/subjects", response_model=APIResponse)
def get_subjects(level_id: int):
    response = service.get_subjects_by_level(level_id)
    if not response.data:
        raise HTTPException(status_code=404, detail="Subject not found")
    subjects = [SubjectInDB(**row["subjects"]) for row in response.data]
    return APIResponse(data = subjects, status = 200)
