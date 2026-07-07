from pydantic import BaseModel

class Level(BaseModel):
    name: str
    exam_system_id: int

class LevelInDB(Level):
    id: int