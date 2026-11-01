from app.core.config.config_file import ADMIN_EMAIL, ADMIN_PASSWORD
from app.services.auth_services import register_service, login_service
from app.database.database_config import async_session
from app.schemas.user_schemas import UserSchema
from app.schemas.login_schema import LoginSchema
from flask import Blueprint, request, jsonify, url_for, make_response, redirect

auth_router = Blueprint("auth", __name__)

@auth_router.post("/register")
async def register_route():

    if request.is_json:

        data = request.get_json()

    else:

        data = request.form.to_dict()

    user_schema = UserSchema(**data)

    async with async_session() as session:

        user = await register_service(user_schema, session)

        return user.model_dump(mode="json"), 201

@auth_router.post("/login")
async def login_route():

    if request.is_json:

        data = request.get_json()

    else:

        data = request.form.to_dict()

    login_schema = LoginSchema(**data)

    async with async_session() as session:

        result = await login_service(login_schema, session)

    response = jsonify({
        "profile": result["profile"]
    })

    response.set_cookie("access_token", result["access_token"], httponly=True, samesite="Lax")
    
    return response, 200

@auth_router.post("/logout")
async def logout_route():

    response = make_response(redirect(url_for("render.render_main_page")))

    response.delete_cookie("access_token")

    return response