from app.core.security.security_file import auth_required
from app.database.database_config import async_session
from app.schemas.review_schemas import ReviewSchema
from app.services.movie_services import *
from app.services.review_services import *
from flask import Blueprint, request, g

movie_router = Blueprint("movies", __name__)

@movie_router.get("/")
@auth_required
async def get_all_movies_route():

    async with async_session() as session:

        movies = await get_all_movies(session)

    return movies, 200

@movie_router.get("/order-by-date")
@auth_required
async def order_movies_by_date_route():

    async with async_session() as session:

        movies = await order_movies_by_date(session)

    return movies, 200

@movie_router.get("/order-by-review")
@auth_required
async def order_movies_by_reviews_route():

    async with async_session() as session:

        movies = await order_movies_by_reviews(session)

    return movies, 200

@movie_router.get("/reviews")
@auth_required
async def get_all_reviews_route():

    async with async_session() as session:

        reviews = await get_all_reviews(session)

    return [review.model_dump(mode="json") for review in reviews]

@movie_router.get("/users/<int:user_id>/reviews")
@auth_required
async def get_reviews_by_user_route(user_id: int):

    user_id = g.user_id

    async with async_session() as session:

        reviews = await get_reviews_by_user(user_id, session)

    return reviews

@movie_router.get("/non-reviewed")
@auth_required
async def get_non_reviewed_movies_route():

    user_id = g.user_id

    async with async_session() as session:

        movies = await get_non_reviewed_movies(user_id, session)

    return movies, 200

@movie_router.post("/<int:movie_id>/reviews")
@auth_required
async def create_review_route(movie_id: int):

    user_id = g.user_id

    review_schema = ReviewSchema(
        movie_id=movie_id,
        author_id=user_id,
        content=request.form.get("content"),
        grade=request.form.get("grade")
    )

    async with async_session() as session:

        review = await create_review(review_schema, session)

    return ReviewResponseSchema.model_validate(review).model_dump(mode="json"), 201

@movie_router.get("/<int:movie_id>/reviews")
@auth_required
async def get_reviews_by_movie_route(movie_id: int):

    async with async_session() as session:

        reviews = await get_reviews_by_movie(movie_id, session)

    return [review.model_dump(mode="json") for review in reviews], 200