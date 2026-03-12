# Road Detection Admin Dashboard

A modern, Leaflet-powered web admin dashboard for the Road Detection system. Real-time visualization of detected potholes and road issues across Karnataka using OpenStreetMap.

## Features

✅ **Interactive Leaflet Map** - Real-time visualization with OpenStreetMap tiles  
✅ **Severity Filtering** - Color-coded markers (Critical, High, Medium, Low)  
✅ **Live Statistics** - Dashboard showing detection counts and status  
✅ **Location List** - Searchable sidebar with all detection areas  
✅ **Auto-Refresh** - Updates every 30 seconds  
✅ **Responsive Design** - Works on desktop, tablet, and mobile  
✅ **Zero Dependencies** - Pure HTML/CSS/JavaScript frontend (Leaflet + OpenStreetMap)  

## Setup

### Prerequisites

- Node.js (v14+)
- Backend API running on `http://localhost:8082`

### Installation

```bash
cd admin-web
npm install
```

### Start Local Development Server

```bash
npm start
```

The dashboard will be available at:
- **Home**: http://localhost:3000
- **Map View**: http://localhost:3000/map.html

## Architecture

```
admin-web/
├── server.js              # Express server + API proxy
├── public/
│   ├── index.html        # Landing page
│   └── map.html          # Leaflet map dashboard
└── package.json          # Dependencies
```

## How It Works

1. **Frontend** (`map.html`) loads Leaflet and OpenStreetMap tiles
2. **Express Server** (`server.js`) proxies requests to backend API
3. **Backend API** (`http://localhost:8082/api/potholes/locations`) provides pothole data
4. **Markers** render on map with color coding based on severity
5. **Real-time Updates** via auto-refresh every 30 seconds

## API Endpoints Used

| Endpoint | Purpose |
|----------|---------|
| `/api/potholes/locations` | Get all detected potholes |
| `/api/potholes` | Get stored potholes from database |
| `/health` | Check admin dashboard status |

## Marker Colors

- 🔴 **Red (#ef4444)** - Critical (61+ issues)
- 🟠 **Orange (#f59e0b)** - High (36-60 issues)
- 🟡 **Yellow (#eab308)** - Medium (16-35 issues)
- 🟢 **Green (#10b981)** - Low (1-15 issues)

## Troubleshooting

### Map doesn't show markers
1. Check if backend is running: `http://localhost:8082/api/potholes/locations`
2. Ensure coordinates are valid numbers (not undefined)
3. Click "Refresh" button to reload data

### Can't connect to backend
```bash
# Verify backend is running
curl http://localhost:8082/api/potholes/locations

# If not, start Spring Boot
cd backend
./mvnw spring-boot:run
```

### CORS errors
- Express server already proxies API requests
- Make requests to `/api/*` instead of directly to backend

## Future Enhancements

- [ ] Search/filter by area name
- [ ] Export detection data to CSV
- [ ] Historical trend charts
- [ ] User authentication
- [ ] Multi-layer map analysis
- [ ] Real-time WebSocket updates

## Related

- **Mobile App**: `frontend-mobile/` - React Native detection app
- **Backend**: `backend/` - Spring Boot REST API
- **Model**: `model/` - Python YOLO detection engine

---

**Status**: ✅ Running on port 3000  
**Powered by**: Leaflet + OpenStreetMap + Express.js
