from app.models.review_models import Review
from app.models.movie_models import Movie
from app.schemas.review_schemas import ReviewSchema, ReviewResponseSchema
from flask import g
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from werkzeug.exceptions import NotFound, BadRequest

async def get_all_reviews(session: AsyncSession):

    query = select(Review)

    result = await session.execute(query)

    reviews = result.scalars().all()

    if not reviews:

        raise NotFound("Nenhuma avaliação encontrada.")

    return [ReviewResponseSchema.model_validate(review) for review in reviews]

async def get_reviews_by_movie(movie_id: int, session: AsyncSession):

    query = select(Review).where(Review.movie_id == movie_id)

    result = await session.execute(query)

    reviews = result.scalars().all()

    if not reviews:

        raise NotFound("Nenhuma avaliação encontrada para este filme.")

    return [ReviewResponseSchema.model_validate(review) for review in reviews]

async def get_reviews_by_user(user_id: int, session: AsyncSession):

    query = (
        select(Review, Movie.title)
        .join(Movie, Review.movie_id == Movie.id)
        .where(Review.author_id == user_id)
    )

    result = await session.execute(query)
    reviews = result.all()

    if not reviews:
        raise NotFound("Nenhuma avaliação feita por esse usuário encontrada.")

    return [
        {
            "id": review.id,
            "movie_id": review.movie_id,
            "movie_title": movie_title,
            "content": review.content,
            "grade": review.grade,
            "reviewed_at": review.reviewed_at,
            "offensive": review.offensive,
            "offensive_check": review.offensive_check
        }

        for review, movie_title in reviews
    ]

async def create_review(review_schema: ReviewSchema, session: AsyncSession):

    user_id = g.user_id

    if not review_schema.grade or not review_schema.content:

        raise BadRequest("É necessário colocar a nota do filme e um comentário para avaliá-lo.")

    new_review = Review(
        movie_id=review_schema.movie_id,
        author_id=user_id,
        grade=review_schema.grade,
        content=review_schema.content
    )

    session.add(new_review)

    await session.commit()

    await session.refresh(new_review)

    return new_review

async def mark_review_as_offensive(review_id: int, session: AsyncSession):

    query = select(Review).where(Review.id == review_id)

    result = await session.execute(query)

    review = result.scalar_one_or_none()

    if not review:

        raise NotFound("Avaliação não encontrada")

    review.offensive = "S"

    await session.commit()

    return review

async def get_all_potentially_offensive_reviews(session: AsyncSession):

    query = select(Review).where(Review.offensive == "S", Review.offensive_check == "N")

    result = await session.execute(query)

    reviews = result.scalars().all()

    if not reviews:

        raise NotFound("Nenhuma avaliação potencialmente ofensiva encontrada.")

    return [ReviewResponseSchema.model_validate(review).model_dump(mode="json") for review in reviews]