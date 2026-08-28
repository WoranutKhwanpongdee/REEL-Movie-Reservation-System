from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from app.schemas.movie import MovieOut
from app.schemas.cinema import CinemaOut


class ShowtimeBase(BaseModel):
    movie_id: int
    cinema_id: int
    start_time: datetime
    price: float
    format: str = "Standard"


class ShowtimeCreate(ShowtimeBase):
    pass


class ShowtimeUpdate(BaseModel):
    start_time: Optional[datetime] = None
    price: Optional[float] = None
    format: Optional[str] = None


class ShowtimeOut(ShowtimeBase):
    id: int
    movie: MovieOut
    cinema: CinemaOut

    class Config:
        from_attributes = True


class ShowtimeSimple(ShowtimeBase):
    id: int

    class Config:
        from_attributes = True
