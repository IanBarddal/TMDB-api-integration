from pydantic import BaseModel
from datetime import date

class MovieSchema(BaseModel):

    title: str
    brief_description: str | None

    class Config():

        from_attributes = True

class MovieResponseSchema(BaseModel):

    id: int
    title: str
    description: str
    brief_description: str | None
    release_date: date
    poster: str | None

    class Config():

        from_attributes = True