from sqlalchemy import Column, Integer, String, Float, Text, Boolean
from sqlalchemy.orm import relationship
from app.database import Base


class Movie(Base):
    __tablename__ = "movies"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False, index=True)
    description = Column(Text)
    genre = Column(String)
    duration = Column(Integer)  # minutes
    rating = Column(Float)
    release_year = Column(Integer)
    poster_url = Column(String)
    backdrop_url = Column(String)
    trailer_url = Column(String)
    director = Column(String)
    cast = Column(Text)  # comma-separated
    is_featured = Column(Boolean, default=False)

    showtimes = relationship("Showtime", back_populates="movie")
