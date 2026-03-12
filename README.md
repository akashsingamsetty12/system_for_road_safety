# 🛣️ Road Pothole Detection System

A complete mobile-first system for detecting and visualizing potholes using YOLOv8 object detection. Real-time image & video processing with map-based location tracking.

## 🏗️ System Architecture

```
┌─────────────────────────────────┐
│   Mobile App (Expo React Native) │ Port 8081
│    - Image Detection              │
│    - Video Processing             │
│    - Location Mapping             │
└──────────────┬────────────────────┘
               │ HTTP REST API
               │
┌──────────────▼────────────────────┐
│  Spring Boot Backend (Java 17)     │ Port 8082
│    - Image/Video endpoints         │
│    - Pothole storage w/ MongoDB    │
│    - Connection pooling & logging  │
└──────────────┬────────────────────┘
               │ HTTP REST API
               │
┌──────────────▼────────────────────┐
│   FastAPI YOLO Detection Server    │ Port 8087
│    - YOLOv8 Model (road.pt)        │
│    - Image detection               │
│    - Frame-by-frame processing     │
└────────────────────────────────────┘
```

| Service | Port | Technology | Status |
|---------|------|-----------|--------|
| Mobile App | 19003 | Expo, React Native 0.72 | ✅ Running |
| **Admin Dashboard** | **3000** | **Leaflet + OpenStreetMap** | ✅ **NEW** |
| Java Backend | 8082 | Spring Boot 4.0.3, Maven | ✅ Running |
| YOLO API | 8087 | FastAPI, uvicorn | ✅ Running |
| Database | 27017 | MongoDB (optional) | ⚠️ Not required for MVP |

---

## 📋 Prerequisites

- **Java 17+** (for backend)
- **Python 3.8+** (for YOLO API)
- **Node.js 16+** (for frontend)
- **Maven** (for Java build)
- **pip** (Python package manager)
- **Expo CLI**: `npm install -g expo-cli`
- **Phone on same WiFi as laptop** (for mobile testing)

---

## 🚀 Quick Start (All 3 Services)

### **Terminal 1: YOLO API (Port 8087)**

```bash
cd d:\Hackathon1\RoadDetection\model
pip install -r requirements.txt
python detect.py
```

✅ Verify: `curl http://localhost:8087/docs`

### **Terminal 2: Spring Boot Backend (Port 8082)**

```bash
cd d:\Hackathon1\RoadDetection\backend
mvn clean package -DskipTests
mvn spring-boot:run
```

✅ Verify: `curl http://localhost:8082/api/health`

Response:
```json
{"backend":"Online","status":"UP","timestamp":1773334194207}
```

### **Terminal 3: Expo Mobile Frontend (Port 8081)**

```bash
cd d:\Hackathon1\RoadDetection\frontend-mobile
npm install
npm start
```

Then:
- Press `a` for Android
- Scan QR code with **Expo Go** app on phone
- App starts on phone ✅

### **Terminal 4: Admin Dashboard (Port 3000) - NEW ✨**

```bash
cd d:\Hackathon1\RoadDetection\admin-web
npm install
npm start
```

✅ Open browser: `http://localhost:3000`

**Features:**
- 🗺️ **Real-time Leaflet Map** powered by OpenStreetMap
- 📍 **Live Marker Visualization** of all detected potholes
- 📊 **Severity Statistics** (Critical, High, Medium, Low)
- 🔄 **Auto-refresh** every 30 seconds
- 📱 **Responsive Design** (desktop, tablet, mobile)

---

## 🔌 Network Configuration for Mobile

### **Important: Phone Cannot Use `localhost`**

Your system IP (from Expo): **`10.104.154.182`**

**Update in [frontend-mobile/src/services/api.js](frontend-mobile/src/services/api.js):**
```javascript
export const API_BASE_URL = 'http://10.104.154.182:8082/api';
export const MODEL_BASE_URL = 'http://10.104.154.182:8087';
```

**Backend allows external connections via [application.properties](backend/src/main/resources/application.properties):**
```properties
server.address=0.0.0.0
server.port=8082
```

✅ **Test from phone browser:**
```
http://10.104.154.182:8082/api/health
```

Should return: `{"backend":"Online","status":"UP"}`

---

## 📱 Mobile App Features

Once you start the app with `npm start` and press `a`:

| Feature | Screen | Function |
|---------|--------|----------|
| 📸 **Image Detection** | ImageDetectionScreen | Capture photo, send to backend, get detections |
| 🎥 **Video Detection** | VideoDetectionScreen | Upload video, process frames with YOLO |
| 📍 **Location Map** | AdminDashboardScreen | View all detected potholes on map |
| ⚙️ **Health Check** | Any screen | `checkBackendHealth()` if connection fails |
| 🔐 **Admin Login** | AdminLoginScreen | Backend monitoring (optional) |

---

## 🔌 API Endpoints

### **Image Detection**
```
POST /api/potholes/detect
Content-Type: multipart/form-data
Parameter: file (image)

Response:
{
  "detections": [...],
  "image_base64": "...",
  "processing_time_ms": 234
}
```

### **Video Detection**
```
POST /api/potholes/detect-video
Content-Type: multipart/form-data
Parameter: file (video)

Response:
{
  "video_url": "/videos/processed_video.mp4",
  "frame_count": 120,
  "detections_per_frame": [...]
}
```

### **Health Check**
```
GET /api/health

Response:
{
  "backend": "Online",
  "status": "UP",
  "timestamp": 1773334194207
}
```

### **Detailed Health**
```
GET /api/health/detailed

Response includes backend version, YOLO API config, MongoDB status
```

---

## 📂 Project Structure

```
RoadDetection/
├── backend/                          # Spring Boot 4.0.3
│   ├── src/main/java/.../
│   │   ├── controller/               # REST endpoints
│   │   ├── service/                  # Business logic
│   │   └── config/                   # RestTemplate, logging
│   ├── src/main/resources/
│   │   └── application.properties    # Port 8082, MongoDB URL
│   └── pom.xml                       # Maven dependencies
│
├── model/                            # FastAPI YOLO Server
│   ├── detect.py                     # Uvicorn app on port 8087
│   ├── process_video.py              # Frame processing
│   └── requirements.txt              # Python dependencies
│
├── frontend-mobile/                  # Expo React Native
│   ├── src/services/
│   │   └── api.js                    # Axios client (uses 10.104.154.182)
│   ├── src/screens/
│   │   ├── ImageDetectionScreen.js
│   │   ├── VideoDetectionScreen.js
│   │   └── AdminDashboardScreen.js
│   └── package.json
│
└── README.md                         # This file
```

---

## 🐛 Troubleshooting

### **Phone Can't Connect to Backend**
```bash
# 1. Check if phone & laptop on same WiFi
# 2. Test from phone browser:
http://10.104.154.182:8082/api/health

# 3. If fails, check Windows Firewall:
# Settings → Privacy & Security → Firewall → Allow an app through
# Allow: Java/Spring Boot, Python
```

### **Blue Expo Error on Phone**
- Check Metro terminal for red error stack
- Press `w` in Metro terminal to test web version
- If web works but phone doesn't → network issue
- If web also fails → React code bug

### **Backend Won't Start**
```bash
# Clear Maven cache
mvn clean

# Rebuild
mvn clean package -DskipTests

# Run with logs
mvn spring-boot:run -DskipTests
```

### **YOLO API Port 8087 Already in Use**
```bash
# Find process using port 8087
netstat -ano | findstr :8087

# Kill process
taskkill /PID <PID> /F

# Then restart: python detect.py
```

### **Metro Cache Corruption**
```bash
# In frontend directory
npx expo start --clear
```

---

## ✅ Verification Checklist

```
☐ YOLO API responding: curl http://localhost:8087/docs
☐ Backend health: curl http://localhost:8082/api/health
☐ Phone can reach backend: curl http://10.104.154.182:8082/api/health (from phone)
☐ Expo app loads on phone with QR code scan
☐ Image detection works: Upload photo → See results
☐ Video detection works: Upload video → Get processed video
☐ Map shows pothole locations
```

---

## 📊 Technology Stack

- **Frontend**: Expo 49, React Native 0.72.10, Axios, react-native-maps
- **Backend**: Spring Boot 4.0.3, Java 17, Maven, Apache HTTPClient 5
- **API Server**: FastAPI, Uvicorn, YOLOv8 (ultralytics)
- **Database**: MongoDB (optional, for production)
- **Logging**: SLF4J with request/response interceptors

---

## 🎯 Currently Working

✅ All 3 services running and responding  
✅ Mobile app connects to backend via network IP  
✅ Image detection: Phone → Backend → YOLO API → Response  
✅ Health endpoints for diagnostics  
✅ Request/response logging with timing  
✅ Connection pooling configured  

**System is ready for production testing!** 🚀

---

## 📞 Support

For issues, check:
1. [frontend-mobile/src/services/api.js](frontend-mobile/src/services/api.js) - API configuration
2. [backend/src/main/resources/application.properties](backend/src/main/resources/application.properties) - Backend config
3. Metro terminal for errors
4. Browser console on phone (via Metro Dev Tools)
      "class": "pothole",
      "class_id": 0
    }
  ],
  "image": "base64_encoded_image_with_boxes",
  "count": 1,
  "width": 1920,
  "height": 1080
}
```

## How to Use

1. Open `http://localhost:8080/` in your browser
2. Select an image containing road sections with potholes
3. Click "Detect Potholes" button
4. View results with:
   - Image with bounding boxes drawn
   - Count of detected potholes
   - Detailed detection information (coordinates, confidence)

## Troubleshooting

### Python API Connection Error
- Ensure FastAPI is running on port 8000
- Check `application.properties` - verify `yolo.api.url=http://localhost:8000/detect`

### YOLO Model Not Found
- Ensure `road.pt` exists in the `python-yolo-api` directory
- The model will auto-download on first run if missing

### Database Connection Issues
- Check MongoDB connection string in `application.properties`
- Ensure MongoDB cluster is accessible

## Configuration

Edit `backend/src/main/resources/application.properties`:

```properties
# Python API endpoint
yolo.api.url=http://localhost:8000/detect

# Backend port
server.port=8080

# MongoDB connection
spring.data.mongodb.uri=your_mongodb_uri
spring.data.mongodb.database=roaddetectiondb
```

## Project Structure

```
.
├── backend/                          # Spring Boot Java backend
│   ├── src/main/java/
│   │   └── com/example/backend/
│   │       ├── controller/          # REST controllers
│   │       ├── service/             # Business logic
│   │       ├── model/               # Data models
│   │       └── repository/          # Database access
│   ├── src/main/resources/
│   │   ├── static/
│   │   │   └── index.html          # Web UI
│   │   └── application.properties   # Configuration
│   └── pom.xml                      # Maven dependencies
│
└── python-yolo-api/                 # FastAPI YOLO detection service
    ├── detect.py                    # YOLO detection API
    ├── road.pt                      # YOLO model file
    └── requirements.txt             # Python dependencies
```

## Technologies Used

- **Backend**: Spring Boot, Spring Data MongoDB, RestTemplate
- **Detection**: YOLOv8, OpenCV, NumPy
- **Frontend**: HTML5, CSS3, JavaScript (Fetch API)
- **Framework**: FastAPI, Uvicorn
- **Database**: MongoDB

## Detection Improvements Made

1. **Confidence Filtering** - Only returns detections above 50% confidence
2. **Detailed Metadata** - Each detection includes coordinates, confidence, and class info
3. **Visualization** - Bounding boxes drawn on image server-side for immediate display
4. **Responsive UI** - Modern, mobile-friendly web interface
5. **Error Handling** - Proper error messages and loading states
6. **Base64 Encoding** - Images transmitted efficiently over HTTP

## Future Enhancements

- [ ] Multi-image batch processing
- [ ] Detection confidence threshold adjustment via UI
- [ ] Historical detection database and analytics
- [ ] Performance metrics and benchmarking
- [ ] Mobile app support
- [ ] Real-time video stream processing
- [ ] Multiple model support (different road conditions)

## License

This project is part of the Hackathon initiative for road safety improvement.
