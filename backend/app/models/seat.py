from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base


class Seat(Base):
    __tablename__ = "seats"

    id = Column(Integer, primary_key=True, index=True)
    showtime_id = Column(Integer, ForeignKey("showtimes.id"), nullable=False)
    row = Column(String, nullable=False)
    number = Column(Integer, nullable=False)
    is_booked = Column(Boolean, default=False)

    showtime = relationship("Showtime", back_populates="seats")
    booking = relationship("Booking", back_populates="seat", uselist=False)
