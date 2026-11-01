from app.core.security.security_file import auth_required, admin_required
from flask import Blueprint, render_template

render_router = Blueprint("render", __name__)

@render_router.get("/")
def render_main_page():

    return render_template("index.html")


@render_router.get("/register")
def render_register_page():

    return render_template("register.html")

@render_router.get("/admin")
@auth_required
@admin_required
async def render_admin_page():

    return render_template("admin.html")

@render_router.get("/register_success")
def render_register_success_page():

    return render_template("register_success.html")

@render_router.get("/main")
@auth_required
def render_app_main_page():

    return render_template("main.html")