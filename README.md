# Road Pothole Detection System

A complete web-based system for detecting and visualizing potholes in road images using YOLO object detection.

## Architecture

- **Backend**: Spring Boot (Java) REST API - runs on port 8080
- **Python API**: FastAPI service for YOLO detection - runs on port 8000
- **Frontend**: Modern web interface with image upload and real-time detection visualization

## Setup & Installation

### Prerequisites
- Java 17+
- Python 3.8+
- pip (Python package manager)
- Maven (for building Java backend)

### 1. Setup Python YOLO API

Navigate to the python-yolo-api directory:

```bash
cd python-yolo-api
```

Install Python dependencies:

```bash
pip install -r requirements.txt
```

Start the FastAPI server:

```bash
uvicorn detect:app --reload --port 8000
```

The API will be available at `http://localhost:8000`

### 2. Setup Java Backend

In another terminal, navigate to the backend directory:

```bash
cd backend
```

Build the project with Maven:

```bash
mvn clean install
```

Run the Spring Boot application:

```bash
mvn spring-boot:run
```

The backend will start on `http://localhost:8080` and expose:
- Web Interface: `http://localhost:8080/`
- API Endpoint: `http://localhost:8080/potholes/detect`

## Features

### Detection Features
✅ **Confidence Thresholding** - Only detections above 0.5 confidence are returned
✅ **Bounding Boxes** - Accurate pothole localization with pixel coordinates
✅ **Confidence Scores** - Each detection includes a confidence percentage
✅ **Class Information** - Classifications for each detected object

### Web Interface Features
✅ **Image Upload** - Drag & drop or file selection
✅ **Real-time Detection** - Process images and get results instantly
✅ **Visual Boxes** - Bounding boxes drawn directly on the image
✅ **Detection List** - Detailed list of all detections with coordinates
✅ **Statistics** - Image dimensions and detection count

## API Endpoints

### POST /potholes/detect
Upload an image for pothole detection.

**Request:**
```
Content-Type: multipart/form-data
File: image (JPEG, PNG, etc.)
```

**Response:**
```json
{
  "detections": [
    {
      "x1": 100.5,
      "y1": 200.3,
      "x2": 250.8,
      "y2": 350.2,
      "confidence": 0.9542,
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
