from pydantic import BaseModel
from typing import Optional


class CinemaBase(BaseModel):
    name: str
    location: str
    description: Optional[str] = None
    total_rows: int = 8
    seats_per_row: int = 10


class CinemaCreate(CinemaBase):
    pass


class CinemaUpdate(CinemaBase):
    name: Optional[str] = None
    location: Optional[str] = None


class CinemaOut(CinemaBase):
    id: int

    class Config:
        from_attributes = True
