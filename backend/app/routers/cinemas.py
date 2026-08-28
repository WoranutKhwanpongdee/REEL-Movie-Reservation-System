from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.cinema import Cinema
from app.schemas.cinema import CinemaOut

router = APIRouter(prefix="/api/cinemas", tags=["cinemas"])


@router.get("", response_model=List[CinemaOut])
def list_cinemas(db: Session = Depends(get_db)):
    return db.query(Cinema).all()


@router.get("/{cinema_id}", response_model=CinemaOut)
def get_cinema(cinema_id: int, db: Session = Depends(get_db)):
    cinema = db.query(Cinema).filter(Cinema.id == cinema_id).first()
    if not cinema:
        raise HTTPException(status_code=404, detail="Cinema not found")
    return cinema
