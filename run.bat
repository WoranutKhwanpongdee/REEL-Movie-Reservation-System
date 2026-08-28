@echo off
title REEL Movie Reservation System Launcher
echo ===================================================
echo   Starting REEL Movie Reservation System...
echo ===================================================

:: Start Backend
start "REEL - Backend (FastAPI)" cmd /k "cd /d %~dp0backend && .venv\Scripts\activate && uvicorn app.main:app --reload --host 127.0.0.1 --port 8000"

:: Start Frontend
start "REEL - Frontend (Next.js)" cmd /k "cd /d %~dp0frontend && npm run dev"

echo.
echo [OK] Both servers are starting!
echo  - Frontend : http://localhost:3000
echo  - Backend  : http://127.0.0.1:8000
echo  - API Docs : http://127.0.0.1:8000/docs
echo ===================================================
timeout /t 5
