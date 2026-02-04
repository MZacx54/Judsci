@echo off
echo Starting JDPC Bauchi Digital Platform...

:: Start Backend
start "JDPC Backend" cmd /k "cd backend && venv\Scripts\activate && python manage.py runserver 0.0.0.0:8000"

:: Start Frontend
start "JDPC Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo Servers are starting...
echo Backend: http://localhost:8000/admin
echo Frontend: http://localhost:3000 (or 3001/3002 if busy)
echo.
echo You can minimize this window, but do not close the pop-up terminals.
pause
