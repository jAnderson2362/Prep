from fastapi import APIRouter, HTTPException
import services.topic as service
from models.response import APIResponse

router = APIRouter(prefix="/standards", tags=["standards"])

@router.get("/{standard_id}/topics", response_model=APIResponse)
def get_topics(standard_id: int):
    response = service.get_topics_by_standard(standard_id)
    if not response.data:
        raise HTTPException(status_code=404, detail="Topic not found")
    return APIResponse(data = response.data, status = 200)