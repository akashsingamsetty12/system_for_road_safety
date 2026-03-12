@echo off
REM Quick Start Script for Road Pothole Detection (Windows)

echo.
echo ==========================================
echo Road Pothole Detection - Quick Start
echo ==========================================
echo.

REM Start Python API
echo 1. Starting Python YOLO API on port 8000...
cd python-yolo-api
echo Installing Python dependencies...
pip install -r requirements.txt >nul 2>&1
echo Starting FastAPI server...
start "Python YOLO API" cmd /k "uvicorn detect:app --reload --port 8000"
echo.

REM Wait for Python API to start
echo Waiting for Python API to initialize...
timeout /t 5 /nobreak

REM Start Java Backend
cd ..
echo 2. Starting Spring Boot Backend on port 8080...
cd backend
echo Building Maven project...
call mvn clean install >nul 2>&1
echo Starting Spring Boot application...
start "Java Backend" cmd /k "mvn spring-boot:run"
echo.

timeout /t 10 /nobreak

echo.
echo ==========================================
echo Services Starting:
echo X Python YOLO API: http://localhost:8000
echo X Java Backend API: http://localhost:8080
echo X Web Interface: http://localhost:8080/
echo.
echo The web interface will be available shortly.
echo Open http://localhost:8080/ in your browser
echo ==========================================
echo.

pause
