from app.database.database_config import Base
from sqlalchemy import Column, Integer, String

class User(Base):

    __tablename__ = "users"

    id = Column("IDUSUARIO", Integer, primary_key=True, autoincrement=True)
    name = Column("NOME", String(120), nullable=False)
    email = Column("EMAIL", String(120), nullable=False, unique=True)
    password = Column("SENHA", String(255), nullable=False)
    profile = Column("PERFIL", String(8), nullable=False, default="USUARIO")
    blocked = Column("BLOQUEADO", String(1), nullable=False, default="S")