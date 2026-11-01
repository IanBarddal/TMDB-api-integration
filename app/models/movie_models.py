from app.database.database_config import Base
from sqlalchemy import Column, Integer, String, Date

class Movie(Base):

    __tablename__ = "movies"

    id = Column("IDFILME", Integer, primary_key=True, autoincrement=True)
    title = Column("TITULO", String(200), nullable=False)
    description = Column("DESCRICAO", String(500), nullable=False)
    brief_description = Column("DESCRICAO_BREVE", String(100))
    release_date = Column("DATA_ESTREIA", Date, nullable=False)
    poster = Column("URL_POSTER", String(255))