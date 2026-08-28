
<h1 align="center">🎬 REEL — Dark Cinematic Movie Reservation System</h1>

<p align="center">
  A modern, full-stack, real-time movie ticket reservation web application featuring a dark cinematic UI, interactive seat map selection, reservation management, and an admin analytics dashboard.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16.3.3-black?style=flat-square&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19.2.8-blue?style=flat-square&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/FastAPI-0.115+-009688?style=flat-square&logo=fastapi" alt="FastAPI" />
  <img src="https://img.shields.io/badge/Python-3.10+-3776AB?style=flat-square&logo=python" alt="Python" />
  <img src="https://img.shields.io/badge/TailwindCSS-v4-38B2AC?style=flat-square&logo=tailwind-css" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/SQLite-Relational-003B57?style=flat-square&logo=sqlite" alt="SQLite" />
</p>

---

## ✨ Features

### 🍿 User Experience & Booking
* **Hero Spotlight & Trailer Modal:** Featured hero carousel spotlighting upcoming blockbusters with high-resolution 4K backdrops and embedded YouTube trailers.
* **Curated Movie Catalog (16 Blockbusters):** Search, filter by genre (Action, Sci-Fi, Drama, Comedy, Horror), and browse current releases and upcoming 2025–2026 premieres.
* **Interactive Cinema Seat Map:** Real-time seat availability visualization with seat category tiers (Standard, Premium, VIP Couch) and cinema format options (*IMAX with Laser, Dolby Atmos, 4DX, RealD 3D, Standard Digital*).
* **Instant Digital Ticket & Celebration:** Interactive booking flow with Canvas Confetti celebration effects, unique reference codes (`REL-XXXXX`), and printable receipt summary.
* **My Bookings Dashboard (`/my-bookings`):** View active tickets, review booking history, and cancel reservations with instant seat release.

### 🛡️ Admin & Management (`/admin`)
* **Live Analytics & KPI Cards:** Total revenue, ticket sales count, active movie catalog size, and overall occupancy rate.
* **Movie & Showtime Management:** Add, inspect, and manage movies and screening schedules.
* **Role-based Access Control (RBAC):** Admin privilege protection ensuring sensitive endpoints and dashboard routes are restricted.

### 🎨 Design & Typography
* **Cinematic Dark Theme:** Rich deep-space palette (`#08090C`, `#0E1117`), amber/gold accents (`#E5A93C`, `#F5C518`), and subtle glassmorphism.
* **Typography Pairing:** **Plus Jakarta Sans** (clean, modern body text), **Outfit** (striking cinematic display headings), and **JetBrains Mono** (crisp seat codes & ticket reference badges).

---

## 🛠️ Tech Stack

### 🎨 Frontend (Client)
| Technology | Version | Description |
| :--- | :--- | :--- |
| **[Next.js](https://nextjs.org/)** | `16.3.3` | React framework with App Router, SSR, and API client |
| **[React](https://react.dev/)** | `19.2.8` | Component-based UI library |
| **[TypeScript](https://www.typescriptlang.org/)** | `5.x` | Static typing and interfaces |
| **[Tailwind CSS](https://tailwindcss.com/)** | `4.x` | Utility-first CSS styling & responsive layout |
| **[Lucide React](https://lucide.dev/)** | `1.34.0` | Comprehensive iconography |
| **[Canvas Confetti](https://www.npmjs.com/package/canvas-confetti)** | `1.9.4` | Interactive particle celebration on confirmed bookings |
| **[Google Fonts](https://fonts.google.com/)** | Web Fonts | Plus Jakarta Sans, Outfit, JetBrains Mono |

### ⚙️ Backend (API & Services)
| Technology | Version | Description |
| :--- | :--- | :--- |
| **[FastAPI](https://fastapi.tiangolo.com/)** | `0.115+` | Async Python web framework with OpenAPI / Swagger documentation |
| **[Python](https://www.python.org/)** | `3.10+` | Core backend language |
| **[Uvicorn](https://www.uvicorn.org/)** | `0.34+` | High-performance ASGI web server |
| **[SQLAlchemy](https://www.sqlalchemy.org/)** | `2.0+` | Python SQL Toolkit and Object-Relational Mapper (ORM) |
| **[Pydantic](https://docs.pydantic.dev/)** | `2.x` | Request validation and schema serialization |
| **[Python-Jose & Passlib](https://github.com/mpdavis/python-jose)** | Latest | JWT authentication & Bcrypt password encryption |

### 🗄️ Database
| Database | Details |
| :--- | :--- |
| **SQLite (Default)** | Lightweight local database stored at `backend/reel.db` |
| **PostgreSQL (Optional)** | Production SQL database support via `DATABASE_URL` in `.env` |

---

## 🎬 Movie Catalog (16 Titles)

| # | Movie Title | Year | Genre | Highlight / Format |
| :-: | :--- | :-: | :---: | :--- |
| 1 | **Spider-Man: Brand New Day** | 2026 | Action / Sci-Fi | ⭐ Hero Spotlight / IMAX Laser |
| 2 | **Avatar: Fire and Ash** | 2026 | Sci-Fi / Adventure | 3D / IMAX Laser |
| 3 | **Wicked: For Good** | 2025 | Drama / Fantasy | Dolby Atmos |
| 4 | **Avengers: Doomsday** | 2026 | Action / Sci-Fi | IMAX Laser |
| 5 | **The Batman Part II** | 2026 | Action / Crime | 4DX / Dolby Atmos |
| 6 | **Project Hail Mary** | 2026 | Sci-Fi / Adventure | IMAX Laser |
| 7 | **The Mandalorian & Grogu** | 2026 | Sci-Fi / Action | Dolby Atmos |
| 8 | **Toy Story 5** | 2026 | Comedy / Animation | RealD 3D |
| 9 | **Supergirl: Woman of Tomorrow** | 2026 | Action / Sci-Fi | Standard / Dolby Atmos |
| 10 | **Dune: Part Two** | 2024 | Sci-Fi / Drama | IMAX Laser |
| 11 | **Oppenheimer** | 2023 | Drama / History | IMAX 70mm / Dolby Atmos |
| 12 | **Alien: Romulus** | 2024 | Horror / Sci-Fi | 4DX / Dolby Atmos |
| 13 | **Gladiator II** | 2024 | Action / Drama | IMAX Laser |
| 14 | **Interstellar** | 2014 | Sci-Fi / Adventure | IMAX 70mm |
| 15 | **Blade Runner 2049** | 2017 | Sci-Fi / Mystery | Dolby Atmos |
| 16 | **Jurassic World** | 2015 | Action / Adventure | RealD 3D |

---

## 🏗️ Project Structure

```
REEL-Movie Reservation System/
├── run.bat                      # One-click launcher script for Windows
├── README.md                    # Main Project Documentation
│
├── backend/                     # FastAPI Python Backend
│   ├── app/
│   │   ├── core/                # JWT Security & Config settings
│   │   ├── models/              # SQLAlchemy Database ORM Models (User, Movie, Cinema, Showtime, Seat, Booking)
│   │   ├── schemas/             # Pydantic Request/Response Models
│   │   ├── routers/             # API Endpoints (auth, movies, cinemas, showtimes, bookings, admin)
│   │   ├── database.py          # SQLite engine and session factory
│   │   ├── dependencies.py      # Dependency injection (Auth tokens, DB sessions)
│   │   └── main.py              # FastAPI Application Entrypoint & CORS setup
│   ├── scripts/
│   │   └── seed.py              # Seeder (16 movies, 3 cinemas, 672 showtimes, 42,784 seats)
│   ├── requirements.txt         # Python Dependencies
│   └── README.md                # Backend API Documentation
│
└── frontend/                    # Next.js App Router Frontend
    ├── src/
    │   ├── app/                 # Next.js App Router Pages
    │   │   ├── page.tsx         # Home Page (Hero Spotlight, Now Showing, Coming Soon)
    │   │   ├── movies/          # Movie Catalog & Movie Details Modal
    │   │   ├── book/[showtimeId]# Interactive Seat Map & Ticket Checkout
    │   │   ├── booking/confirmation/[ref] # Digital Ticket Pass & Print Receipt
    │   │   ├── my-bookings/     # User Ticket Management & Cancellation
    │   │   └── admin/           # Admin Analytics Dashboard & Management
    │   ├── components/          # Categorized Reusable UI Components
    │   │   ├── auth/            # Login & Register Modal Dialogs
    │   │   ├── booking/         # SeatMap, SeatLegend, CheckoutSummary, TicketPass
    │   │   ├── layout/          # Cinematic Navbar, Footer
    │   │   └── movies/          # MovieCard, MovieGrid, TrailerModal
    │   ├── context/             # AuthContext Global State Provider
    │   ├── lib/                 # API Client helper with JWT bearer handling
    │   └── types/               # Full TypeScript Definitions
    ├── public/                  # Static Assets (Logos, Icons)
    ├── package.json
    └── tsconfig.json
```

---

## ⚡ Quick Start

### Option 1: One-Click Launch (Windows)
Simply double click [`run.bat`](run.bat) or run:
```cmd
run.bat
```
*(This script automatically verifies python, sets up the virtual environment, installs backend/frontend packages, seeds the database if needed, and launches both servers concurrently.)*

---

### Option 2: Manual Setup

#### 1. Backend Setup
```bash
# Navigate to backend folder
cd backend

# Create & activate virtual environment
python -m venv .venv
# Windows:
.venv\Scripts\activate
# Linux/macOS:
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Seed the database (16 movies, cinemas, showtimes & seats)
python scripts/seed.py

# Start FastAPI server
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

#### 2. Frontend Setup
```bash
# Navigate to frontend folder (in a new terminal)
cd frontend

# Install dependencies
npm install

# Start Next.js development server
npm run dev
```

---

## 🌐 Endpoints & Access

| Service | URL | Description |
| :--- | :--- | :--- |
| **Frontend Web App** | [http://localhost:3000](http://localhost:3000) | Main User Interface |
| **Backend REST API** | [http://127.0.0.1:8000](http://127.0.0.1:8000) | FastAPI Base URL |
| **Interactive API Docs** | [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs) | Swagger UI for testing endpoints |
| **ReDoc API Docs** | [http://127.0.0.1:8000/redoc](http://127.0.0.1:8000/redoc) | Alternative API Documentation |

---

## 🔑 Default Accounts

| Role | Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| 🛡️ **Administrator** | `admin@reel.com` | `admin123` | Full access + Admin Dashboard (`/admin`) |
| 👤 **Standard Customer** | `john@example.com` | `password123` | Booking tickets, viewing & canceling orders |

---

## 📄 License
This project is open-source and built for educational and demonstration purposes.
