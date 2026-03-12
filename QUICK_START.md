# 🚀 Quick Start - Image Detection Fix

## Summary of Changes

✅ **Fixed YOLO API Port Mismatch**
- Python script: `localhost:8087` → `localhost:5000`
- Backend: Confirms `localhost:5000`

✅ **Unified API URLs**
- Frontend now uses centralized `API_BASE_URL`
- No more hardcoded IP addresses (10.47.111.30)

✅ **Added Health Check Endpoints**
- `GET /api/health` - Basic check
- `GET /api/health/detailed` - Full diagnostics
- `GET /api/health/test-image-detection` - Image endpoint status
- `GET /api/health/test-video-detection` - Video endpoint status

✅ **Added Frontend Health Functions**
- `checkBackendHealth()`
- `checkDetailedHealth()`
- `checkImageDetectionReady()`
- `checkVideoDetectionReady()`

✅ **Cleanup Script**
- `cleanup.bat` - Remove temp files and caches

---

## ⚡ 5-Minute Setup

### Terminal 1: Backend
```bash
cd d:\Hackathon1\RoadDetection
cd backend
mvn clean package
mvn spring-boot:run
```

**Wait for:** `Tomcat started on port 8082 with context path '/api'`

### Terminal 2: YOLO API
```bash
cd d:\Hackathon1\RoadDetection\model

# Option A: If running Python Flask server
python -m flask run --port 5000

# Option B: If running detect.py script
python detect.py
```

### Terminal 3: Frontend
```bash
cd d:\Hackathon1\RoadDetection\frontend-mobile
npx expo start
```

Press `r` to reload app

---

## 🧪 Test Image Detection

### Step 1: Verify Backend is Online
```bash
curl http://localhost:8082/api/health
```

Should return:
```json
{"status":"UP","backend":"Online","timestamp":1234567890}
```

### Step 2: Verify Image Detection Endpoint
```bash
curl http://localhost:8082/api/health/test-image-detection
```

Should return:
```json
{
  "endpoint":"/potholes/detect",
  "method":"POST",
  "status":"Ready"
}
```

### Step 3: Test from App
1. Open app → Image Detection
2. Take photo
3. Tap "Detect"
4. Check console logs for:
   ```
   📤 API Request: POST /potholes/detect
   📥 API Response: 200 /potholes/detect [1250ms]
   ```

### Step 4: Verify Results
- App should show detection results
- Backend logs should show timing info

---

## 📊 Expected Response Times

| Step | Duration | Status |
|------|----------|--------|
| Network roundtrip | < 100ms | ✅ Good |
| Image preprocessing | < 500ms | ✅ Good |
| YOLO detection | 1-5s | ✅ Normal |
| **Total (Image)** | **1-6s** | **✅ Good** |

---

## 🔍 If Image Detection Fails

### Check 1: Network Connectivity
```bash
# From app terminal console:
console.log('API_BASE_URL:', API_BASE_URL);

# Should show: API_BASE_URL: http://localhost:8082/api
```

### Check 2: Backend Logs
Look for in backend terminal:
```
📨 [REQUEST] POST /api/potholes/detect
📥 [RESPONSE] POST /api/potholes/detect | Status: 200
```

If shows `Status: 500` → Check YOLO API connection

### Check 3: YOLO API Status
```bash
# In YOLO terminal, look for:
# - Flask server running on port 5000
# - No connection errors

# Test connectivity from backend:
curl http://localhost:5000/detect
```

### Check 4: File Permissions
```bash
# Ensure model file exists and is readable
dir d:\Hackathon1\RoadDetection\model\road.pt
```

---

## 🧹 Cleanup (Optional)

```bash
cd d:\Hackathon1\RoadDetection
cleanup.bat
```

This removes:
- `video_temp/` - temporary videos
- `backend\Hackathon1RoadDetectionvideo_temp/` - duplicate folder
- `backend\target/` - build artifacts
- Cache files

---

## 📱 For Physical Device Testing

If testing on actual Android/iOS device:

1. Find your machine IP:
   ```bash
   ipconfig
   # Note the IPv4 Address (e.g., 192.168.1.100)
   ```

2. Set environment variable or update `frontend-mobile/src/services/api.js`:
   ```javascript
   export const API_BASE_URL = 'http://192.168.1.100:8082/api';
   ```

3. Ensure device is on same WiFi network

4. Test connectivity:
   ```bash
   # From device browser or terminal
   curl http://192.168.1.100:8082/api/health
   ```

---

## ✅ Verification Checklist

- [ ] Backend starts without errors
- [ ] YOLO API server is running
- [ ] `curl http://localhost:8082/api/health` returns 200
- [ ] `curl http://localhost:5000/` shows YOLO API (or similar)
- [ ] Frontend reload shows no connection errors
- [ ] Image upload from app completes
- [ ] Detection results appear in app
- [ ] Console logs show timing info

---

## 📚 Full Documentation

- **Architecture & Diagnostics**: See `CONNECTIVITY_DIAGNOSTICS.md`
- **Detailed Troubleshooting**: See `IMAGE_DETECTION_TROUBLESHOOTING.md`
- **API Endpoints**: See backend `HealthCheckController.java`

---

## 💬 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| "Cannot POST /potholes/detect" | Check API_BASE_URL in frontend, restart backend |
| "Connection refused to YOLO" | Start YOLO API on port 5000 |
| Empty detection results | Check YOLO model file exists, restart YOLO service |
| Upload timeout | Check file size < 5MB for images, < 500MB for videos |
| "Cannot convert undefined to object" | Check `/api/potholes/locations` endpoint returns valid data |

---

## 🚀 You're All Set!

Your backend and frontend are now properly connected. Image detection should work smoothly!

**Next Steps:**
1. Run the quick setup above
2. Test with a sample image
3. Monitor logs for timing/errors
4. Enjoy detecting road damage! 🎉
