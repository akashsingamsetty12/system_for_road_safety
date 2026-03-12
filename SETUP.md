# Road Detection System - Complete Setup Guide

A full-stack application for detecting potholes, plastic, and litter on roads using YOLO object detection.

## 📋 Project Structure

```
RoadDetection/
├── frontend/                    # React web application
│   ├── public/
│   ├── src/
│   │   ├── components/         # React components
│   │   ├── services/           # API integration
│   │   └── styles/             # CSS styling
│   ├── package.json
│   ├── start.bat / start.sh    # Startup scripts
│   └── README.md
├── backend/                     # Java Spring Boot API
│   ├── src/
│   │   ├── main/java/
│   │   │   └── com/example/backend/
│   │   │       ├── controller/       # REST endpoints
│   │   │       ├── service/          # Business logic
│   │   │       ├── model/            # Data models
│   │   │       └── repository/       # Database access
│   │   └── resources/
│   │       └── static/               # Frontend files (built)
│   ├── pom.xml
│   ├── mvnw / mvnw.cmd         # Maven wrapper
│   └── HELP.md
├── python-yolo-api/            # YOLO Detection Engine
│   ├── detect.py               # Detection script
│   ├── requirements.txt        # Python dependencies
│   └── road.pt                 # YOLO model
├── start.bat / start.sh        # Main startup scripts
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js v14+ and npm
- Java 17+
- Python 3.8+
- Maven

### Option 1: Windows (using batch files)

1. **Setup Frontend:**
```bash
setup-frontend.bat
```

2. **Start Frontend (in a new terminal):**
```bash
cd frontend
start.bat
```

3. **Start Backend (in another terminal):**
```bash
cd backend
./mvnw spring-boot:run
```

4. **Start Python YOLO API (in another terminal):**
```bash
cd python-yolo-api
python -m pip install -r requirements.txt
python detect.py
```

### Option 2: Manual Setup

#### Frontend Setup
```bash
cd frontend
npm install
npm start
# Opens at http://localhost:3000
```

#### Backend Setup
```bash
cd backend
./mvnw clean install
./mvnw spring-boot:run
# Runs at http://localhost:8080
```

#### Python YOLO API Setup
```bash
cd python-yolo-api
pip install -r requirements.txt
python detect.py
# Running on http://localhost:5000
```

## 🎯 Features

### Frontend (React)
- ✅ Drag-and-drop image upload
- ✅ Real-time object detection visualization
- ✅ Detection confidence scores
- ✅ Class-based result filtering (Pothole, Plastic, Other Litter)
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Beautiful modern UI with gradient backgrounds

### Backend (Spring Boot)
- ✅ RESTful API endpoints
- ✅ Image upload handling
- ✅ Integration with YOLO detection service
- ✅ Detection history storage
- ✅ Database persistence

### Python YOLO API
- ✅ YOLOv5 object detection
- ✅ Three-class detection (pothole, plastic, other litter)
- ✅ Bounding box generation
- ✅ Confidence scoring
- ✅ Real-time processing

## 📡 API Endpoints

### Detection Endpoints

**Upload Image and Detect:**
```
POST /api/potholes/detect
Content-Type: multipart/form-data

Body: {
  "image": <binary_image_data>
}

Response: {
  "id": "uuid",
  "detections": [
    {
      "class": "pothole",
      "confidence": 0.95,
      "x": 100,
      "y": 200,
      "width": 50,
      "height": 50
    }
  ],
  "message": "Detection completed successfully"
}
```

**Get All Detections:**
```
GET /api/potholes
Response: [{...}, {...}]
```

**Get Detection by ID:**
```
GET /api/potholes/{id}
Response: {...}
```

## 🎨 Detection Classes

1. **🕳️ Pothole** - Damaged road surface with holes or cracks
2. **♻️ Plastic** - Plastic waste and bottles on the road
3. **🗑️ Other Litter** - General garbage, debris, and other waste

## 🔧 Configuration

### Frontend Configuration
Edit `frontend/.env`:
```
REACT_APP_API_URL=http://localhost:8080/api
```

### Backend Configuration
Edit `backend/src/main/resources/application.properties`:
```properties
# Server
server.port=8080

# Python YOLO API
yolo.api.url=http://localhost:5000

# Database (if configured)
spring.datasource.url=jdbc:h2:mem:testdb
```

### Python YOLO Configuration
Edit `python-yolo-api/detect.py`:
```python
# Model settings
MODEL_PATH = 'road.pt'
CONFIDENCE_THRESHOLD = 0.5
IOU_THRESHOLD = 0.45
```

## 🧪 Testing

### Test Frontend
```bash
cd frontend
npm test
```

### Test Backend
```bash
cd backend
./mvnw test
```

## 📦 Building for Production

### Frontend Build
```bash
cd frontend
npm run build
# Creates optimized build in build/ directory
```

### Backend Build
```bash
cd backend
./mvnw clean package
# Creates JAR file in target/
```

### Deploy Frontend to Backend
```bash
cd frontend
npm run build
cp -r build/* ../backend/src/main/resources/static/
cd ../backend
./mvnw package
```

## 🐛 Troubleshooting

### Frontend Issues

**Port 3000 in use:**
```bash
# Kill process on port 3000
npx kill-port 3000
npm start
```

**API Connection Error:**
- Check backend is running on http://localhost:8080
- Verify CORS is enabled in backend
- Check `.env` file has correct API URL

### Backend Issues

**Port 8080 in use:**
```bash
lsof -i :8080
kill -9 <PID>
```

**Java version mismatch:**
```bash
# Ensure Java 17+ is installed
java -version
```

### Python YOLO Issues

**Model not found:**
```bash
# Verify road.pt exists in python-yolo-api/
ls -la python-yolo-api/road.pt
```

**Dependencies missing:**
```bash
pip install -r python-yolo-api/requirements.txt
```

## 📈 Performance Tips

1. **Optimize Images:** Compress images before upload for faster processing
2. **Enable Caching:** Configure browser caching for static assets
3. **Database Indexing:** Add indexes on frequently queried fields
4. **API Rate Limiting:** Implement rate limiting to prevent abuse
5. **Model Optimization:** Use quantized YOLO model for faster inference

## 🔐 Security Considerations

- ✅ Validate file uploads (size, type)
- ✅ Implement rate limiting
- ✅ Use HTTPS in production
- ✅ Secure API endpoints with authentication
- ✅ Sanitize user inputs
- ✅ Enable CORS properly

## 📚 Additional Resources

- [React Documentation](https://react.dev)
- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [YOLOv5 Documentation](https://docs.ultralytics.com)
- [Java 17 Documentation](https://docs.oracle.com/en/java/javase/17/)

## 🤝 Contributing

1. Create a feature branch: `git checkout -b feature/new-feature`
2. Commit changes: `git commit -am 'Add new feature'`
3. Push to branch: `git push origin feature/new-feature`
4. Submit a pull request

## 📄 License

MIT License - Feel free to use and modify

## 📞 Support

For issues or questions:
1. Check the README files in each folder
2. Review troubleshooting section above
3. Check console logs for error messages
4. Open an issue on the repository

---

**Happy Road Detection! 🛣️🚗**
