from app.core.config.config_file import DATABASE_URL
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy.pool import NullPool

class Base(DeclarativeBase):

    pass

async_engine = create_async_engine(DATABASE_URL, echo=True, poolclass=NullPool)

async_session = async_sessionmaker(bind=async_engine, expire_on_commit=False)