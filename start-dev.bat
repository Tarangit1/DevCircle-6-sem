@echo off
echo 🚀 Starting DevCircle Development Environment...
echo.

REM Check if .env exists in backend
if not exist "backend\.env" (
    echo ⚠️  backend\.env file not found. Creating from .env.example...
    copy backend\.env.example backend\.env
    echo ⚠️  Please edit backend\.env with your configuration
    pause
    exit /b 1
)

echo 🔧 Starting Backend Server...
cd backend
if not exist "node_modules" (
    echo 📦 Installing backend dependencies...
    call npm install
)
start "DevCircle Backend" cmd /k npm run dev
cd ..

echo.
echo ⏳ Waiting for backend to start...
timeout /t 5 /nobreak > nul

echo 🎨 Starting Frontend...
cd frontend
if not exist "node_modules" (
    echo 📦 Installing frontend dependencies...
    call npm install
)
start "DevCircle Frontend" cmd /k npm run dev
cd ..

echo.
echo ✨ DevCircle is running!
echo.
echo 📍 Backend:  http://localhost:5000
echo 📍 Frontend: http://localhost:5173
echo.
echo Press any key to exit...
pause > nul
