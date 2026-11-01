import requests
import httpx
from app.core.config.config_file import IMDB_READ_TOKEN

async def search_imdb_title(title: str):

    async with httpx.AsyncClient() as client:

        response = await client.get(
            f"https://api.themoviedb.org/3/search/movie",
            headers={
                "Authorization": f"Bearer {IMDB_READ_TOKEN}"
            },
            params={
                "query": {title.strip()}
            }
        )

    response.raise_for_status()

    data = response.json()

    movie = data["results"][0]

    return {
        "id": movie["id"],
        "title": movie["title"],
        "description": movie["overview"],
        "release_date": movie["release_date"],
        "poster": movie["poster_path"] if movie["poster_path"] else None
    }