@echo off
REM Cleanup script for Road Detection project
REM This removes temporary files and unnecessary directories

echo.
echo ========================================
echo   Road Detection - Cleanup Script
echo ========================================
echo.

echo Removing temporary video files...
if exist "video_temp" (
    rmdir /s /q video_temp
    echo ✓ Deleted video_temp/
) else (
    echo - video_temp/ not found
)

echo.
echo Removing duplicate temp folders in backend...
if exist "backend\Hackathon1RoadDetectionvideo_temp" (
    rmdir /s /q backend\Hackathon1RoadDetectionvideo_temp
    echo ✓ Deleted backend/Hackathon1RoadDetectionvideo_temp/
) else (
    echo - backend/Hackathon1RoadDetectionvideo_temp/ not found
)

echo.
echo Removing node_modules caches...
if exist "frontend-mobile\node_modules\.cache" (
    rmdir /s /q frontend-mobile\node_modules\.cache
    echo ✓ Deleted frontend-mobile/node_modules/.cache/
) else (
    echo - Cache not found
)

echo.
echo Removing Java build artifacts...
if exist "backend\target" (
    rmdir /s /q backend\target
    echo ✓ Deleted backend/target/
) else (
    echo - Backend build artifacts not found
)

echo.
echo Cleanup complete!
echo.
echo To rebuild:
echo   1. cd backend
echo   2. mvn clean package
echo   3. mvn spring-boot:run
echo.
pause
