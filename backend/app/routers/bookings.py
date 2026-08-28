import uuid
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from typing import List, Union
from app.database import get_db
from app.models.booking import Booking, BookingStatus
from app.models.seat import Seat
from app.models.showtime import Showtime
from app.schemas.booking import BookingCreate, BookingOut
from app.dependencies import get_current_user
from app.models.user import User

router = APIRouter(prefix="/api/bookings", tags=["bookings"])


@router.post("", response_model=List[BookingOut], status_code=201)
def create_booking(
    booking_data: BookingCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    target_seat_ids = []
    if booking_data.seat_ids and len(booking_data.seat_ids) > 0:
        target_seat_ids = booking_data.seat_ids
    elif booking_data.seat_id:
        target_seat_ids = [booking_data.seat_id]
    else:
        raise HTTPException(status_code=400, detail="No seats specified for booking")

    showtime = db.query(Showtime).filter(Showtime.id == booking_data.showtime_id).first()
    if not showtime:
        raise HTTPException(status_code=404, detail="Showtime not found")

    seats = (
        db.query(Seat)
        .filter(Seat.id.in_(target_seat_ids), Seat.showtime_id == booking_data.showtime_id)
        .all()
    )
    if len(seats) != len(target_seat_ids):
        raise HTTPException(status_code=404, detail="One or more selected seats were not found")

    for s in seats:
        if s.is_booked:
            raise HTTPException(
                status_code=400,
                detail=f"Seat {s.row}{s.number} is already reserved by another customer",
            )

    reference = f"REL-{uuid.uuid4().hex[:6].upper()}"
    new_bookings = []
    for s in seats:
        s.is_booked = True
        b = Booking(
            user_id=current_user.id,
            showtime_id=booking_data.showtime_id,
            seat_id=s.id,
            total_price=showtime.price,
            booking_reference=reference,
        )
        db.add(b)
        new_bookings.append(b)

    db.commit()

    booking_ids = [b.id for b in new_bookings]
    result = (
        db.query(Booking)
        .options(
            joinedload(Booking.showtime).joinedload(Showtime.movie),
            joinedload(Booking.showtime).joinedload(Showtime.cinema),
            joinedload(Booking.seat),
        )
        .filter(Booking.id.in_(booking_ids))
        .all()
    )
    return result


@router.get("/my", response_model=List[BookingOut])
def get_my_bookings(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    bookings = (
        db.query(Booking)
        .options(
            joinedload(Booking.showtime).joinedload(Showtime.movie),
            joinedload(Booking.showtime).joinedload(Showtime.cinema),
            joinedload(Booking.seat),
        )
        .filter(Booking.user_id == current_user.id)
        .order_by(Booking.created_at.desc())
        .all()
    )
    return bookings


@router.get("/reference/{reference}", response_model=List[BookingOut])
def get_bookings_by_reference(
    reference: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    bookings = (
        db.query(Booking)
        .options(
            joinedload(Booking.showtime).joinedload(Showtime.movie),
            joinedload(Booking.showtime).joinedload(Showtime.cinema),
            joinedload(Booking.seat),
        )
        .filter(Booking.booking_reference == reference)
        .all()
    )
    if not bookings:
        raise HTTPException(status_code=404, detail="Booking reference not found")
    if not current_user.is_admin and any(b.user_id != current_user.id for b in bookings):
        raise HTTPException(status_code=403, detail="Not authorized to view these tickets")
    return bookings


@router.delete("/{booking_id}", response_model=BookingOut)
def cancel_booking(
    booking_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    query = (
        db.query(Booking)
        .options(
            joinedload(Booking.showtime).joinedload(Showtime.movie),
            joinedload(Booking.showtime).joinedload(Showtime.cinema),
            joinedload(Booking.seat),
        )
        .filter(Booking.id == booking_id)
    )
    if not current_user.is_admin:
        query = query.filter(Booking.user_id == current_user.id)

    booking = query.first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    if booking.status == BookingStatus.cancelled:
        raise HTTPException(status_code=400, detail="Booking is already cancelled")

    booking.status = BookingStatus.cancelled
    if booking.seat:
        booking.seat.is_booked = False
    db.commit()
    db.refresh(booking)
    return booking


@router.post("/cancel-reference/{reference}", response_model=List[BookingOut])
def cancel_booking_reference(
    reference: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    query = (
        db.query(Booking)
        .options(
            joinedload(Booking.showtime).joinedload(Showtime.movie),
            joinedload(Booking.showtime).joinedload(Showtime.cinema),
            joinedload(Booking.seat),
        )
        .filter(Booking.booking_reference == reference)
    )
    if not current_user.is_admin:
        query = query.filter(Booking.user_id == current_user.id)

    bookings = query.all()
    if not bookings:
        raise HTTPException(status_code=404, detail="No active bookings found for reference")

    for b in bookings:
        b.status = BookingStatus.cancelled
        if b.seat:
            b.seat.is_booked = False

    db.commit()
    return bookings
