from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List
from app.schemas.showtime import ShowtimeOut
from app.schemas.seat import SeatOut


class BookingCreate(BaseModel):
    showtime_id: int
    seat_id: Optional[int] = None
    seat_ids: Optional[List[int]] = None


class BookingOut(BaseModel):
    id: int
    user_id: int
    showtime_id: int
    seat_id: int
    status: str
    total_price: float
    booking_reference: str
    created_at: datetime
    showtime: ShowtimeOut
    seat: SeatOut

    class Config:
        from_attributes = True


class BookingSimple(BaseModel):
    id: int
    status: str
    total_price: float
    booking_reference: str
    created_at: datetime

    class Config:
        from_attributes = True
