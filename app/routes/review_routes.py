from app.core.security.security_file import auth_required, admin_required
from app.database.database_config import async_session
from app.schemas.review_schemas import ReviewResponseSchema
from app.services.review_services import mark_review_as_offensive, get_all_potentially_offensive_reviews
from flask import Blueprint

review_router = Blueprint("reviews", __name__)

@review_router.patch("/<int:review_id>/offensive")
@auth_required
async def mark_review_as_offensive_route(review_id: int):

    async with async_session() as session:

        review = await mark_review_as_offensive(review_id, session)

    return ReviewResponseSchema.model_validate(review).model_dump(mode="json"), 200

@review_router.get("/offensive")
@auth_required
@admin_required
async def get_all_potentially_offensive_reviews_route():

    async with async_session() as session:

        reviews = await get_all_potentially_offensive_reviews(session)

    return reviews, 200