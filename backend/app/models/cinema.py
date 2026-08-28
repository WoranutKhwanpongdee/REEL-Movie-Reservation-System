from sqlalchemy import Column, Integer, String, Text
from sqlalchemy.orm import relationship
from app.database import Base


class Cinema(Base):
    __tablename__ = "cinemas"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    location = Column(String, nullable=False)
    description = Column(Text)
    total_rows = Column(Integer, default=8)
    seats_per_row = Column(Integer, default=10)

    showtimes = relationship("Showtime", back_populates="cinema")
