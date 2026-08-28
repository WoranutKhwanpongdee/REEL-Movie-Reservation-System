from pydantic import BaseModel
from typing import Optional


class SeatBase(BaseModel):
    showtime_id: int
    row: str
    number: int


class SeatOut(SeatBase):
    id: int
    is_booked: bool

    class Config:
        from_attributes = True
