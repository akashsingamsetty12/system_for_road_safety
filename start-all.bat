@echo off
REM Start all services

echo.
echo 🚀 Road Detection System - Starting All Services
echo ================================================
echo.

REM Start Backend (Spring Boot)
echo 1️⃣  Starting Backend API (port 8082)...
cd backend
start cmd /k "mvnw spring-boot:run"
cd ..
timeout /t 5 /nobreak

REM Start Python Model Server
echo 2️⃣  Starting YOLO Detection Server (port 8087)...
start cmd /k "cd model && python app.py"
timeout /t 3 /nobreak

REM Start Frontend Mobile
echo 3️⃣  Starting Mobile App...
start cmd /k "cd frontend-mobile && npm start"
timeout /t 3 /nobreak

REM Start Admin Dashboard
echo 4️⃣  Starting Admin Dashboard (port 3000)...
start cmd /k "cd admin-web && npm install && npm start"

echo.
echo ✅ All services started!
echo.
echo 📱 Mobile App:      http://localhost:19000 (Expo)
echo 🌐 Admin Dashboard: http://localhost:3000
echo 🔧 Backend API:     http://localhost:8082/api
echo 🤖 YOLO Server:     http://localhost:8087
echo.
echo Press any key to close this window...
pause
