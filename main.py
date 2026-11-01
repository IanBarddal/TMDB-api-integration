from flask import Flask
from flask_cors import CORS
import asyncio

app = Flask(__name__)

CORS(app)

from app.handlers.error_handler import register_errors_handler

register_errors_handler(app)

from app.services.auth_services import create_admin
from app.database.database_config import async_session

async def initialize_admin():

    async with async_session() as session:

        return await create_admin(session)

from app.routes.health_routes import health_router
from app.routes.render_routes import render_router
from app.routes.auth_routes import auth_router
from app.routes.user_routes import users_router
from app.routes.movie_routes import movie_router
from app.routes.review_routes import review_router
from app.routes.admin_routes import admin_router

app.register_blueprint(render_router)
app.register_blueprint(health_router, url_prefix="/health")
app.register_blueprint(auth_router, url_prefix="/api/auth")
app.register_blueprint(users_router, url_prefix="/api/users")
app.register_blueprint(movie_router, url_prefix="/api/movies")
app.register_blueprint(review_router, url_prefix="/api/reviews")
app.register_blueprint(admin_router, url_prefix="/api/admin")

if __name__ == "__main__":
    asyncio.run(initialize_admin())
    app.run(debug=True)