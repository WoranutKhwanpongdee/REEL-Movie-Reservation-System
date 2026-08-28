from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func
from sqlalchemy.orm import Session, joinedload
from typing import List
from app.database import get_db
from app.models.movie import Movie
from app.models.cinema import Cinema
from app.models.showtime import Showtime
from app.models.booking import Booking, BookingStatus
from app.models.user import User
from app.schemas.movie import MovieCreate, MovieUpdate, MovieOut
from app.schemas.cinema import CinemaCreate, CinemaUpdate, CinemaOut
from app.schemas.showtime import ShowtimeCreate, ShowtimeUpdate, ShowtimeOut
from app.schemas.booking import BookingOut
from app.dependencies import get_admin_user

router = APIRouter(prefix="/api/admin", tags=["admin"])


# ── Movies ────────────────────────────────────────────────────────────────────

@router.get("/movies", response_model=List[MovieOut])
def admin_list_movies(db: Session = Depends(get_db), _: User = Depends(get_admin_user)):
    return db.query(Movie).all()


@router.post("/movies", response_model=MovieOut, status_code=201)
def admin_create_movie(data: MovieCreate, db: Session = Depends(get_db), _: User = Depends(get_admin_user)):
    movie = Movie(**data.model_dump())
    db.add(movie)
    db.commit()
    db.refresh(movie)
    return movie


@router.put("/movies/{movie_id}", response_model=MovieOut)
def admin_update_movie(movie_id: int, data: MovieUpdate, db: Session = Depends(get_db), _: User = Depends(get_admin_user)):
    movie = db.query(Movie).filter(Movie.id == movie_id).first()
    if not movie:
        raise HTTPException(status_code=404, detail="Movie not found")
    for k, v in data.model_dump(exclude_unset=True).items():
        setattr(movie, k, v)
    db.commit()
    db.refresh(movie)
    return movie


@router.delete("/movies/{movie_id}")
def admin_delete_movie(movie_id: int, db: Session = Depends(get_db), _: User = Depends(get_admin_user)):
    movie = db.query(Movie).filter(Movie.id == movie_id).first()
    if not movie:
        raise HTTPException(status_code=404, detail="Movie not found")
    
    # Cascade delete showtimes and associated seats/bookings
    showtimes = db.query(Showtime).filter(Showtime.movie_id == movie_id).all()
    for st in showtimes:
        db.query(Booking).filter(Booking.showtime_id == st.id).delete()
        db.query(Seat).filter(Seat.showtime_id == st.id).delete()
        db.delete(st)

    db.delete(movie)
    db.commit()
    return {"detail": "Movie and related showtimes deleted"}


# ── Cinemas ───────────────────────────────────────────────────────────────────

@router.get("/cinemas", response_model=List[CinemaOut])
def admin_list_cinemas(db: Session = Depends(get_db), _: User = Depends(get_admin_user)):
    return db.query(Cinema).all()


@router.post("/cinemas", response_model=CinemaOut, status_code=201)
def admin_create_cinema(data: CinemaCreate, db: Session = Depends(get_db), _: User = Depends(get_admin_user)):
    cinema = Cinema(**data.model_dump())
    db.add(cinema)
    db.commit()
    db.refresh(cinema)
    return cinema


@router.put("/cinemas/{cinema_id}", response_model=CinemaOut)
def admin_update_cinema(cinema_id: int, data: CinemaUpdate, db: Session = Depends(get_db), _: User = Depends(get_admin_user)):
    cinema = db.query(Cinema).filter(Cinema.id == cinema_id).first()
    if not cinema:
        raise HTTPException(status_code=404, detail="Cinema not found")
    for k, v in data.model_dump(exclude_unset=True).items():
        setattr(cinema, k, v)
    db.commit()
    db.refresh(cinema)
    return cinema


@router.delete("/cinemas/{cinema_id}")
def admin_delete_cinema(cinema_id: int, db: Session = Depends(get_db), _: User = Depends(get_admin_user)):
    cinema = db.query(Cinema).filter(Cinema.id == cinema_id).first()
    if not cinema:
        raise HTTPException(status_code=404, detail="Cinema not found")
    
    # Cascade delete showtimes and associated seats/bookings
    showtimes = db.query(Showtime).filter(Showtime.cinema_id == cinema_id).all()
    for st in showtimes:
        db.query(Booking).filter(Booking.showtime_id == st.id).delete()
        db.query(Seat).filter(Seat.showtime_id == st.id).delete()
        db.delete(st)

    db.delete(cinema)
    db.commit()
    return {"detail": "Cinema and related showtimes deleted"}


# ── Showtimes ─────────────────────────────────────────────────────────────────

@router.get("/showtimes", response_model=List[ShowtimeOut])
def admin_list_showtimes(db: Session = Depends(get_db), _: User = Depends(get_admin_user)):
    return (
        db.query(Showtime)
        .options(
            joinedload(Showtime.movie),
            joinedload(Showtime.cinema),
        )
        .all()
    )


@router.post("/showtimes", response_model=ShowtimeOut, status_code=201)
def admin_create_showtime(data: ShowtimeCreate, db: Session = Depends(get_db), _: User = Depends(get_admin_user)):
    showtime = Showtime(**data.model_dump())
    db.add(showtime)
    db.commit()
    db.refresh(showtime)
    
    # Automatically generate seats for the new showtime based on cinema capacity
    cinema = db.query(Cinema).filter(Cinema.id == showtime.cinema_id).first()
    if cinema:
        rows = "ABCDEFGHIJ"[: cinema.total_rows]
        for row in rows:
            for num in range(1, cinema.seats_per_row + 1):
                seat = Seat(showtime_id=showtime.id, row=row, number=num)
                db.add(seat)
        db.commit()

    showtime = (
        db.query(Showtime)
        .options(
            joinedload(Showtime.movie),
            joinedload(Showtime.cinema),
        )
        .filter(Showtime.id == showtime.id)
        .first()
    )
    return showtime


@router.put("/showtimes/{showtime_id}", response_model=ShowtimeOut)
def admin_update_showtime(showtime_id: int, data: ShowtimeUpdate, db: Session = Depends(get_db), _: User = Depends(get_admin_user)):
    showtime = db.query(Showtime).filter(Showtime.id == showtime_id).first()
    if not showtime:
        raise HTTPException(status_code=404, detail="Showtime not found")
    for k, v in data.model_dump(exclude_unset=True).items():
        setattr(showtime, k, v)
    db.commit()
    showtime = (
        db.query(Showtime)
        .options(
            joinedload(Showtime.movie),
            joinedload(Showtime.cinema),
        )
        .filter(Showtime.id == showtime_id)
        .first()
    )
    return showtime


@router.delete("/showtimes/{showtime_id}")
def admin_delete_showtime(showtime_id: int, db: Session = Depends(get_db), _: User = Depends(get_admin_user)):
    showtime = db.query(Showtime).filter(Showtime.id == showtime_id).first()
    if not showtime:
        raise HTTPException(status_code=404, detail="Showtime not found")
    db.query(Booking).filter(Booking.showtime_id == showtime_id).delete()
    db.query(Seat).filter(Seat.showtime_id == showtime_id).delete()
    db.delete(showtime)
    db.commit()
    return {"detail": "Showtime deleted"}


# ── Bookings & Stats ──────────────────────────────────────────────────────────

@router.get("/bookings", response_model=List[BookingOut])
def admin_list_bookings(db: Session = Depends(get_db), _: User = Depends(get_admin_user)):
    return (
        db.query(Booking)
        .options(
            joinedload(Booking.showtime).joinedload(Showtime.movie),
            joinedload(Booking.showtime).joinedload(Showtime.cinema),
            joinedload(Booking.seat),
        )
        .order_by(Booking.created_at.desc())
        .all()
    )


@router.get("/stats")
def admin_stats(db: Session = Depends(get_db), _: User = Depends(get_admin_user)):
    from app.models.seat import Seat
    total_bookings = db.query(Booking).count()
    confirmed = db.query(Booking).filter(Booking.status == BookingStatus.confirmed).count()
    cancelled = db.query(Booking).filter(Booking.status == BookingStatus.cancelled).count()
    revenue_result = (
        db.query(func.sum(Booking.total_price))
        .filter(Booking.status == BookingStatus.confirmed)
        .scalar()
    )
    total_movies = db.query(Movie).count()
    total_users = db.query(User).count()
    total_cinemas = db.query(Cinema).count()
    total_seats = db.query(Seat).count()
    booked_seats = db.query(Seat).filter(Seat.is_booked == True).count()
    occupancy_rate = round((booked_seats / total_seats * 100), 1) if total_seats > 0 else 0

    return {
        "total_bookings": total_bookings,
        "confirmed_bookings": confirmed,
        "cancelled_bookings": cancelled,
        "total_revenue": round(float(revenue_result or 0), 2),
        "total_movies": total_movies,
        "total_users": total_users,
        "total_cinemas": total_cinemas,
        "total_seats": total_seats,
        "booked_seats": booked_seats,
        "occupancy_rate": occupancy_rate,
    }
