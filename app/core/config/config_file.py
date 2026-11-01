from dotenv import load_dotenv
import os

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
DATABASE = os.getenv("DATABASE")
DATABASE_URL = os.getenv("DATABASE_URL")
IMDB_API_KEY = os.getenv("IMDB_API_KEY")
IMDB_READ_TOKEN = os.getenv("IMDB_READ_TOKEN")
ALGORITHM = os.getenv("ALGORITHM") 
ACCESS_TOKEN_EXPIRE_MINUTES = os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES")
ADMIN_EMAIL = os.getenv("ADMIN_EMAIL")
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD")