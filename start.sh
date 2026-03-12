#!/bin/bash
# Quick Start Script for Road Pothole Detection

echo "=========================================="
echo "Road Pothole Detection - Quick Start"
echo "=========================================="
echo ""

# Start Python API
echo "1. Starting Python YOLO API on port 8000..."
cd python-yolo-api
echo "Installing Python dependencies (if needed)..."
pip install -r requirements.txt > /dev/null 2>&1
echo "Starting FastAPI server..."
(
    cd $(pwd)
    uvicorn detect:app --reload --port 8000
) &
PYTHON_PID=$!
echo "Python API PID: $PYTHON_PID"
echo ""

# Wait a bit for Python API to start
echo "Waiting for Python API to start..."
sleep 5

# Start Java Backend
echo "2. Starting Spring Boot Backend on port 8080..."
cd ../backend
echo "Building Maven project..."
mvn clean install > /dev/null 2>&1
echo "Starting Spring Boot application..."
mvn spring-boot:run &
JAVA_PID=$!
echo "Java Backend PID: $JAVA_PID"
echo ""

echo "=========================================="
echo "Services Starting:"
echo "✓ Python YOLO API: http://localhost:8000"
echo "✓ Java Backend API: http://localhost:8080"
echo "✓ Web Interface: http://localhost:8080/"
echo ""
echo "The web interface will be available in 10-15 seconds"
echo "Open http://localhost:8080/ in your browser"
echo ""
echo "To stop all services, press Ctrl+C"
echo "=========================================="

# Keep script running
wait
