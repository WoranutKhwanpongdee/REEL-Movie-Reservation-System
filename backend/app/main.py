from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import Base, engine
from app.models import *  # noqa: F401,F403 – registers all models with Base
from app.routers import auth, movies, cinemas, showtimes, bookings, admin

Base.metadata.create_all(bind=engine)

app = FastAPI(title="REEL API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001", "http://127.0.0.1:3000", "http://127.0.0.1:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(movies.router)
app.include_router(cinemas.router)
app.include_router(showtimes.router)
app.include_router(bookings.router)
app.include_router(admin.router)


@app.get("/api/health")
def health():
    return {"status": "ok"}
