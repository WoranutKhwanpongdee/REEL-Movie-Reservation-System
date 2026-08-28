from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session, joinedload
from typing import List, Optional
from app.database import get_db
from app.models.showtime import Showtime
from app.models.seat import Seat
from app.schemas.showtime import ShowtimeOut
from app.schemas.seat import SeatOut

router = APIRouter(prefix="/api/showtimes", tags=["showtimes"])


@router.get("", response_model=List[ShowtimeOut])
def list_showtimes(
    movie_id: Optional[int] = Query(None),
    cinema_id: Optional[int] = Query(None),
    db: Session = Depends(get_db),
):
    q = db.query(Showtime).options(
        joinedload(Showtime.movie),
        joinedload(Showtime.cinema),
    )
    if movie_id:
        q = q.filter(Showtime.movie_id == movie_id)
    if cinema_id:
        q = q.filter(Showtime.cinema_id == cinema_id)
    return q.all()


@router.get("/{showtime_id}", response_model=ShowtimeOut)
def get_showtime(showtime_id: int, db: Session = Depends(get_db)):
    showtime = (
        db.query(Showtime)
        .options(
            joinedload(Showtime.movie),
            joinedload(Showtime.cinema),
        )
        .filter(Showtime.id == showtime_id)
        .first()
    )
    if not showtime:
        raise HTTPException(status_code=404, detail="Showtime not found")
    return showtime


@router.get("/{showtime_id}/seats", response_model=List[SeatOut])
def get_seats(showtime_id: int, db: Session = Depends(get_db)):
    showtime = db.query(Showtime).filter(Showtime.id == showtime_id).first()
    if not showtime:
        raise HTTPException(status_code=404, detail="Showtime not found")
    seats = db.query(Seat).filter(Seat.showtime_id == showtime_id).all()
    if not seats:
        # Generate seats on first request
        cinema = showtime.cinema
        rows = "ABCDEFGHIJ"[: cinema.total_rows]
        new_seats = []
        for row in rows:
            for num in range(1, cinema.seats_per_row + 1):
                seat = Seat(showtime_id=showtime_id, row=row, number=num)
                db.add(seat)
                new_seats.append(seat)
        db.commit()
        for s in new_seats:
            db.refresh(s)
        return new_seats
    return seats
