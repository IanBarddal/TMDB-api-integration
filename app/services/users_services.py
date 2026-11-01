from app.models.user_models import User
from app.models.review_models import Review
from app.schemas.user_schemas import UserResponseSchema
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from werkzeug.exceptions import NotFound, BadRequest, Unauthorized
from werkzeug.security import generate_password_hash, check_password_hash

async def get_blocked_users(session: AsyncSession):

    query = select(User).where(User.blocked == "S")

    result = await session.execute(query)

    users = result.scalars().all()

    return users

async def get_active_users(session: AsyncSession):

    query = select(User).where(User.blocked == "N")

    result = await session.execute(query)

    users = result.scalars().all()

    return users

async def get_my_user_data(user_id: int, session: AsyncSession):

    query = (
            select(User, func.count(Review.id).label("reviews_count"))
            .outerjoin(Review, Review.author_id == User.id)
            .where(user_id == User.id)
            .group_by(User.id)
        )

    result = await session.execute(query)

    user_data = result.one_or_none()

    if not user_data:

        raise NotFound("Usuário não encontrado")

    user, reviews_count = user_data

    return {
        **UserResponseSchema.model_validate(user).model_dump(mode="json"),
        "reviews_count": reviews_count
    }

async def change_my_password(user_id: int, old_password: str, new_password: str, session: AsyncSession):

    if not old_password or not old_password.strip():
    
        raise BadRequest("É necessário informar a senha antiga.")

    if not new_password or not new_password.strip():

        raise BadRequest("É necessário escolher uma nova senha.")

    query = select(User).where(User.id == user_id)

    result = await session.execute(query)

    user = result.scalar_one_or_none()

    if not check_password_hash(user.password, old_password):

        raise Unauthorized("Senha antiga não confere.")

    if not user:

        raise NotFound("Usuário não encontrado.")

    new_password_hashed = generate_password_hash(new_password)

    user.password = new_password_hashed

    await session.commit()

    await session.refresh(user)

    return UserResponseSchema.model_validate(user)