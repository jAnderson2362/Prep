from typing import Any, Optional
from pydantic import BaseModel

class APIResponse(BaseModel):
    data: Optional[Any] = None
    error: Optional[str] = None
    status: int
