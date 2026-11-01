from app.database.database_config import async_session
from app.services.admin_services import *
from app.core.security.security_file import auth_required, admin_required
from app.schemas.movie_schemas import MovieResponseSchema
from app.schemas.review_schemas import ReviewResponseSchema
from flask import Blueprint, request

admin_router = Blueprint("admin", __name__)

@admin_router.patch("/users/<int:user_id>/unblock")
@auth_required
@admin_required
async def unblock_user_route(user_id: int):

    async with async_session() as session:

        user = await release_user(user_id, session)

        return user.model_dump()

@admin_router.patch("/users/<int:user_id>/block")
@auth_required
@admin_required
async def block_user_route(user_id: int):

    async with async_session() as session:

        user = await block_user(user_id, session)

        return user.model_dump()

@admin_router.patch("/users/<int:user_id>/change_password")
@auth_required
@admin_required
async def change_password_route(user_id: int):

    data = request.get_json()

    new_password = data.get("new_password", "")

    async with async_session() as session:

        user = await change_user_password(user_id, new_password, session)

        return user.model_dump()

@admin_router.patch("/<int:review_id>/check_offensive")
@auth_required
@admin_required
async def check_review_as_offensive_route(review_id: int):

    async with async_session() as session:

        review = await check_review_as_offensive(review_id, session)

    return ReviewResponseSchema.model_validate(review).model_dump(mode="json"), 200

@admin_router.post("/movies")
@auth_required
@admin_required
async def add_movie_route():

    movie_schema = MovieSchema(
        title = request.form.get("title"),
        brief_description = request.form.get("brief_description") or None,
    )

    async with async_session() as session:

        movie = await add_movie(movie_schema, session)

    return MovieResponseSchema.model_validate(movie).model_dump(mode="json"), 201

@admin_router.delete("/movies")
@auth_required
@admin_required
async def delete_movie_route():

    title = request.args.get("title")

    async with async_session() as session:

        return await delete_movie(title, session)