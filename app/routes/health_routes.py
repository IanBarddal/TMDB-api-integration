from app.services.health_services import health_service
from flask import Blueprint

health_router = Blueprint("health", __name__)

@health_router.get("/")
def health_route():

    return health_service()