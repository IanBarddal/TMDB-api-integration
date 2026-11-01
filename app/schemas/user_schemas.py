from pydantic import BaseModel

class UserSchema(BaseModel):

    name: str
    email: str
    password: str

    class Config():

        from_attributes = True

class UserResponseSchema(BaseModel):

    id: int
    name: str
    email: str
    profile: str
    blocked: str

    class Config():

        from_attributes = True

class UserEditSchema(BaseModel):

    name: str | None
    email: str
    password: str | None
    blocked: str | None

    class Config():

        from_attributes = True