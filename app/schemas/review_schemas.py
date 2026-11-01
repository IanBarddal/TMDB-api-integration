from pydantic import BaseModel
from datetime import datetime

class ReviewSchema(BaseModel):

    movie_id: int
    author_id: int
    content: str
    grade: float

    class Config():

        from_attributes = True

class ReviewResponseSchema(BaseModel):

    id: int
    movie_id: int
    author_id: int
    reviewed_at: datetime
    content: str
    grade: float
    offensive: str
    offensive_check: str | None

    class Config():

        from_attributes = True