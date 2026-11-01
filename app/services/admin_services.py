from app.models.user_models import User
from app.models.movie_models import Movie
from app.models.review_models import Review
from app.schemas.user_schemas import UserResponseSchema
from app.schemas.movie_schemas import MovieSchema
from app.services.imdb_services import search_imdb_title
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from werkzeug.exceptions import NotFound, Conflict, Forbidden, BadRequest
from werkzeug.security import generate_password_hash

async def release_user(user_id: int, session: AsyncSession):

    query = select(User).where(User.id == user_id)

    result = await session.execute(query)

    user = result.scalar_one_or_none()

    if not user:

        raise NotFound("Usuário não encontrado.")

    if user.blocked == "N":

        raise Conflict("Usuário já está desbloqueado")

    user.blocked = "N"

    await session.commit()

    await session.refresh(user)

    return UserResponseSchema.model_validate(user)

async def block_user(user_id: int, session: AsyncSession):

    query = select(User).where(User.id == user_id)

    result = await session.execute(query)

    user = result.scalar_one_or_none()

    if not user:

        raise NotFound("Usuário não encontrado.")

    if user.blocked == "S":

        raise Conflict("Usuário já está bloqueado.")

    if user.profile == "ADMIN":

        raise Forbidden("Não é possível bloquear um administrador.")

    user.blocked = "S"

    await session.commit()

    await session.refresh(user)

    return UserResponseSchema.model_validate(user)

async def change_user_password(user_id: int, new_password: str, session: AsyncSession):

    if not new_password:

        raise BadRequest("É obrigatório escolher uma nova senha.")

    query = select(User).where(User.id == user_id)

    result = await session.execute(query)

    user = result.scalar_one_or_none()

    if not user:

        raise NotFound("Usuário não encontrado.")

    if user.blocked == "S":

        raise Forbidden("Usuário está bloqueado. Não é possível mudar sua senha.")

    hashed_password = generate_password_hash(new_password)

    user.password = hashed_password

    await session.commit()

    await session.refresh(user)

    return UserResponseSchema.model_validate(user)

async def add_movie(movie_schema: MovieSchema, session: AsyncSession):

    if not movie_schema.title:

        raise BadRequest("Preencha os dados necessários para cadastrar um filme.")

    movie_search = await search_imdb_title(movie_schema.title)

    if not movie_search:

        raise NotFound("Filme não encontrado.")

    new_movie = Movie(
        title=movie_schema.title,
        description=movie_search["description"],
        brief_description=movie_schema.brief_description,    
        release_date=movie_search["release_date"],
        poster=movie_search["poster"]
    )

    session.add(new_movie)

    await session.commit()

    await session.refresh(new_movie)

    return new_movie

async def delete_movie(title: str, session: AsyncSession):

    if not title:

        raise BadRequest("É necessário informar o título do filme a ser deletado.")

    query = select(Movie).where(Movie.title == title)

    result = await session.execute(query)

    movies = result.scalars().all()

    if not movies:

        raise NotFound("Filme não encontrado.")

    for movie in movies:

        await session.delete(movie)

    await session.commit()

    return {
        "message": "Filme deletado com sucesso."
    }

async def check_review_as_offensive(review_id: int, session: AsyncSession):

    query = select(Review).where(Review.id == review_id)

    result = await session.execute(query)

    review = result.scalar_one_or_none()

    if not review:

        raise NotFound("Avaliação não encontrada.")

    review.offensive_check = "S"

    await session.commit()

    return review