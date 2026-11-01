from app.models.movie_models import Movie
from app.models.review_models import Review
from app.schemas.movie_schemas import MovieResponseSchema
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from werkzeug.exceptions import NotFound

async def get_all_movies(session: AsyncSession):

    query = (
        select(Movie, 
               func.count(Review.id).label("reviews_count"),
               func.avg(Review.grade).label("average_grade"))
        .outerjoin(Review, Movie.id == Review.movie_id)
        .group_by(Movie.id)
        )

    result = await session.execute(query)

    movies = result.all()

    if not movies:

        raise NotFound("Nenhum filme encontrado.")

    return [
        {
            **MovieResponseSchema.model_validate(movie).model_dump(mode="json"),
            "average_grade": float(average_grade) if average_grade is not None else None,
            "reviews_count": reviews_count
        }

        for movie, reviews_count, average_grade in movies
    ]

async def order_movies_by_date(session: AsyncSession):

    query = (
            select(Movie, 
                   func.count(Review.id).label("reviews_count"),
                   func.avg(Review.grade).label("average_grade"))
            .outerjoin(Review, Movie.id == Review.movie_id)
            .group_by(Movie.id)
            .order_by(Movie.release_date.desc())
            )

    result = await session.execute(query)

    movies = result.all()

    if not movies:

        raise NotFound("Nenhum filme encontrado.")

    return [
        {
            **MovieResponseSchema.model_validate(movie).model_dump(mode="json"),
            "average_grade": float(average_grade) if average_grade is not None else None,
            "reviews_count": reviews_count
        }

        for movie, reviews_count, average_grade in movies
    ]

async def order_movies_by_reviews(session: AsyncSession):

    query = (
    select(
        Movie,
        func.avg(Review.grade).label("average_grade"),
        func.count(Review.id).label("reviews_count")
    )
    .outerjoin(Review, Movie.id == Review.movie_id)
    .group_by(Movie.id)
    .order_by(func.avg(Review.grade).desc())
    )

    result = await session.execute(query)

    movies = result.all()

    if not movies:

        raise NotFound("Nenhum filme encontrado")

    return [
        {
            **MovieResponseSchema.model_validate(movie).model_dump(mode="json"),
            "average_grade": float(average_grade) if average_grade is not None else None,
            "reviews_count": reviews_count
        }

        for movie, average_grade, reviews_count in movies
    ]

async def get_non_reviewed_movies(user_id: int, session: AsyncSession):

    review_exists = (
    select(Review.id)
    .where(
        Review.movie_id == Movie.id,
        Review.author_id == user_id
    )
    .exists()
    )

    query = select(Movie).where(~review_exists)

    result = await session.execute(query)

    movies = result.scalars().all()

    if not movies:

        raise NotFound("Não foram encontrados filmes não avaliados.")

    return [
        MovieResponseSchema.model_validate(movie).model_dump(mode="json")
        for movie in movies
    ]