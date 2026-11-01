from app.database.database_config import async_session
from app.services.users_services import *
from app.schemas.user_schemas import UserResponseSchema
from app.core.security.security_file import auth_required, admin_required
from flask import Blueprint, g, request

users_router = Blueprint("users", __name__)

@users_router.get("/blocked")
@auth_required
@admin_required
async def get_blocked_users_route():

    async with async_session() as session:

        users = await get_blocked_users(session)

    return [UserResponseSchema.model_validate(user).model_dump() for user in users]

@users_router.get("/unblocked")
@auth_required
@admin_required
async def get_active_users_route():

    async with async_session() as session:

        users = await get_active_users(session)

    return [UserResponseSchema.model_validate(user).model_dump() for user in users]

@users_router.get("/me")
@auth_required
async def get_my_user_data_route():

    user_id = g.user_id

    async with async_session() as session:

        user = await get_my_user_data(user_id, session)

        if user is None:

            raise NotFound("Usuário não encontrado")
        
        return user, 200

@users_router.patch("/me/change_password")
@auth_required
async def change_my_password_route():

    user_id = g.user_id

    data = request.get_json()

    old_password = data.get("old_password", "")

    new_password = data.get("new_password", "")

    async with async_session() as session:

        user = await change_my_password(user_id, old_password, new_password, session)

    return user.model_dump()