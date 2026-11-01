from pydantic import BaseModel

class AdminSchema(BaseModel):

    name: str
    email: str
    password: str
    profile: str

    class Config():

        from_attributes = True