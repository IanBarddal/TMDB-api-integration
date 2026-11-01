from app.database.database_config import Base
from sqlalchemy import Column, String

class Admin(Base):

    name = Column("NOME", String(5), nullable=False, default="ADMIN")
    email = Column("EMAIL", String(120), nullable=False, unique=True, default="admin@email.com")
    password = Column("SENHA", String(255), nullable=False)
    profile = Column("PERFIL", String(5), nullable=False, default="ADMIN")