from app.database.database_config import Base
from sqlalchemy import Column, Integer, DateTime, String, Float, ForeignKey
from datetime import datetime, timezone

class Review(Base):

    __tablename__ = "reviews"

    id = Column("IDAVALIACAO", Integer, primary_key=True, autoincrement=True)
    author_id = Column("IDAUTOR", Integer, ForeignKey("users.IDUSUARIO"), nullable=False)
    movie_id = Column("IDFILME", Integer, ForeignKey("movies.IDFILME"), nullable=False)
    reviewed_at = Column("DATA_AVALIACAO", DateTime(timezone=True), nullable=False, default=lambda: datetime.now(timezone.utc))
    content = Column("COMENTARIO", String(500), nullable=False)
    grade = Column("NOTA", Float, nullable=False)
    offensive = Column("ALERTA_OFENSIVO", String(1), nullable=False, default="N")
    offensive_check = Column("CHECK_OFENSIVO", String(1), default="N")