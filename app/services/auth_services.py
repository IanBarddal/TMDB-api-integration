from app.models.user_models import User
from app.schemas.user_schemas import *
from app.schemas.login_schema import LoginSchema
from app.core.config.config_file import  ADMIN_EMAIL, ADMIN_PASSWORD
from app.core.security.security_file import create_access_token
from datetime import timedelta
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from werkzeug.exceptions import BadRequest, Conflict, NotFound, Unauthorized, Forbidden
from werkzeug.security import generate_password_hash, check_password_hash

async def register_service(user_schema: UserSchema, session: AsyncSession):

    if not user_schema.name or not user_schema.email or not user_schema.password:

        raise BadRequest("Todos os dados são necessários para o cadastro do usuário.")

    query = select(User).where(User.email == user_schema.email)

    result = await session.execute(query)

    user = result.scalar_one_or_none()

    if user:

        raise Conflict("Usuário já cadastrado com esse e-mail.")

    hashed_password = generate_password_hash(user_schema.password)

    new_user = User(
        name=user_schema.name,
        email=user_schema.email,
        password=hashed_password
    )

    session.add(new_user)

    await session.commit()

    await session.refresh(new_user)

    return UserResponseSchema.model_validate(new_user)

async def create_admin(session: AsyncSession):

    query = select(User).where(User.profile == "ADMIN")

    result = await session.execute(query)

    admin = result.scalar_one_or_none()

    if admin:

        return admin

    hashed_password = generate_password_hash(ADMIN_PASSWORD)

    new_admin = User(
        name="ADMIN",
        email= ADMIN_EMAIL,
        password=hashed_password,
        profile="ADMIN",
        blocked="N"
    )

    session.add(new_admin)

    await session.commit()

    await session.refresh(new_admin)

    return new_admin

async def authenticate_user(email: str, password: str, session: AsyncSession):

    if not email or not password:

        raise BadRequest("Insira seu e-mail e sua senha.")

    query = select(User).where(User.email == email)

    result = await session.execute(query)

    user = result.scalar_one_or_none()

    if not user:

        raise NotFound("Usuário não encontrado.")

    if not check_password_hash(user.password, password):

        raise Unauthorized("E-mail ou senha incorretos.")

    return user

async def login_service(login_schema: LoginSchema, session: AsyncSession):

    user = await authenticate_user(login_schema.email, login_schema.password, session)

    if user.blocked == "S":

        raise Forbidden("Aguarde o desbloqueio do administrador.")

    access_token = create_access_token(user.id)

    refresh_token = create_access_token(user.id, token_duration=timedelta(days=1))

    return {
        "status_code": 200,
        "message": "Login realizado com sucesso!",
        "access_token": access_token,
        "refresh_token": refresh_token,
        "profile": user.profile,
        "token_type": "Bearer"
    }