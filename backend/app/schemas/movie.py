from pydantic import BaseModel
from typing import Optional


class MovieBase(BaseModel):
    title: str
    description: Optional[str] = None
    genre: Optional[str] = None
    duration: Optional[int] = None
    rating: Optional[float] = None
    release_year: Optional[int] = None
    poster_url: Optional[str] = None
    backdrop_url: Optional[str] = None
    trailer_url: Optional[str] = None
    director: Optional[str] = None
    cast: Optional[str] = None
    is_featured: bool = False


class MovieCreate(MovieBase):
    pass


class MovieUpdate(MovieBase):
    title: Optional[str] = None


class MovieOut(MovieBase):
    id: int

    class Config:
        from_attributes = True
