# REEL Backend API (FastAPI)

RESTful API backend for REEL Movie Reservation System built with FastAPI, SQLAlchemy, and SQLite/PostgreSQL.

---

## 📁 Directory Structure

```
backend/
├── app/
│   ├── core/            # App settings & JWT security utilities
│   │   ├── config.py
│   │   └── security.py
│   ├── models/          # SQLAlchemy database ORM models
│   │   ├── user.py
│   │   ├── movie.py
│   │   ├── cinema.py
│   │   ├── showtime.py
│   │   ├── seat.py
│   │   └── booking.py
│   ├── schemas/         # Pydantic data schemas
│   ├── routers/         # API endpoints & controllers
│   │   ├── auth.py      # /api/auth (login, register, me)
│   │   ├── movies.py    # /api/movies
│   │   ├── cinemas.py   # /api/cinemas
│   │   ├── showtimes.py # /api/showtimes
│   │   ├── bookings.py  # /api/bookings
│   │   └── admin.py     # /api/admin (management & analytics)
│   ├── database.py      # Database engine & session maker
│   ├── dependencies.py  # FastAPI dependencies (auth, db)
│   └── main.py          # FastAPI application entrypoint
├── scripts/
│   └── seed.py          # Database seeding script with sample data
├── .env                 # Environment variables
├── .env.example         # Environment template
└── requirements.txt     # Python dependencies
```

---

## 🚀 Getting Started

### 1. Setup Virtual Environment
```bash
python -m venv .venv
# On Windows:
.venv\Scripts\activate
# On Linux/macOS:
source .venv/bin/activate
```

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Seed Database
```bash
python scripts/seed.py
```

### 4. Run Development Server
```bash
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

---

## 📖 API Documentation

Once the server is running:
- **Interactive Swagger UI:** [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
- **ReDoc UI:** [http://127.0.0.1:8000/redoc](http://127.0.0.1:8000/redoc)
