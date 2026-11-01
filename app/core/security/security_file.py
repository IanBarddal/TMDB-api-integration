from app.core.config.config_file import ACCESS_TOKEN_EXPIRE_MINUTES, SECRET_KEY, ALGORITHM
from app.database.database_config import async_session
from app.models.user_models import User
from datetime import datetime, timedelta, timezone
from flask import request, url_for, redirect, g
from functools import wraps
from inspect import iscoroutinefunction
from jose import jwt, JWTError
from sqlalchemy import select

def create_access_token(user_id, token_duration=timedelta(minutes=int(ACCESS_TOKEN_EXPIRE_MINUTES))):

    expiration_time = datetime.now(timezone.utc) + token_duration

    info = {"sub": str(user_id), "exp": expiration_time}

    encoded_jwt = jwt.encode(info, SECRET_KEY, algorithm=ALGORITHM)

    return encoded_jwt

def verify_access_token(token):

    try:

        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])

        user_id = payload.get("sub")

        if user_id is None:

            return None

        return int(user_id)

    except (JWTError, ValueError, TypeError):

        return None

def auth_required(function):

    if iscoroutinefunction(function):

        @wraps(function)
        async def async_wrapper(*args, **kwargs):

            token = request.cookies.get("access_token")

            if not token:
                return redirect(url_for("render.render_main_page"))

            user_id = verify_access_token(token)

            if not user_id:
                return redirect(url_for("render.render_main_page"))

            g.user_id = user_id

            return await function(*args, **kwargs)

        return async_wrapper

    @wraps(function)
    def sync_wrapper(*args, **kwargs):

        token = request.cookies.get("access_token")

        if not token:
            return redirect(url_for("render.render_main_page"))

        user_id = verify_access_token(token)

        if not user_id:
            return redirect(url_for("render.render_main_page"))

        g.user_id = user_id

        return function(*args, **kwargs)

    return sync_wrapper

def admin_required(function):

    if iscoroutinefunction(function):

        @wraps(function)
        async def async_wrapper(*args, **kwargs):
        
            async with async_session() as session:

                query = select(User).where(User.id == g.user_id)

                result = await session.execute(query)

                user = result.scalar_one_or_none()

            if not user or user.profile != "ADMIN":

                return redirect(url_for("render.render_main_page"))

            return await function(*args, **kwargs)
        
        return async_wrapper

    @wraps(function)
    def sync_wrapper(*args, **kwargs):

        return redirect(url_for("render.render_main_page"))

    return sync_wrapper