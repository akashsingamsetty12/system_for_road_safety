# Road Detection Mobile - React Native Expo

A React Native mobile app built with **Expo** for detecting potholes, plastic, and litter on roads.

## 🚀 Quick Start

### Prerequisites
- **Expo CLI** - `npm install -g expo-cli`
- **Expo Go App** - Download from App Store or Google Play
- **Node.js** v14+
- **Backend Server** - Running on http://YOUR_IP:8080
- **Same WiFi Network** - Device and computer must be on same network

### Installation

1. **Navigate to frontend-mobile:**
```bash
cd frontend-mobile
```

2. **Install dependencies:**
```bash
npm install
```

3. **Update API URL** in `src/services/api.js`:
   - Replace `192.168.1.100` with your computer's IP address
   - Find IP: Windows `ipconfig`, Mac `ifconfig`

4. **Start Expo:**
```bash
npm start
```

### Running on Your Phone

**Method 1: Scan QR Code**
1. Open Expo Go app on your phone
2. Scan the QR code shown in terminal
3. App loads in Expo Go

**Method 2: Direct Link**
1. Terminal will show: `exp://192.168.1.100:19000`
2. Copy this link
3. Open in browser on phone or paste in Expo Go

## 📁 Project Structure

```
frontend-mobile/
├── src/
│   ├── screens/
│   │   ├── UploadScreen.js      # Main detection screen
│   │   └── InfoScreen.js        # Help & settings
│   ├── services/
│   │   └── api.js               # Backend API integration
│   └── components/              # Reusable components
├── App.js                       # Main entry point
├── app.json                     # Expo configuration
├── package.json                 # Dependencies
└── README.md
```

## 🎯 Features

### Detection Screen
- 📷 **Take Photos** - Capture from camera
- 🖼️ **Upload Images** - Select from gallery
- 🔍 **Real-time Detection** - YOLO-powered analysis
- 📊 **Detection Results** - Class counts and confidence scores
- ✨ **Beautiful UI** - Modern gradient design

### Info Screen
- 📋 Supported detection classes
- 📝 Step-by-step usage guide
- ⚙️ System requirements
- 🔧 Configuration instructions
- 🐛 Troubleshooting tips

## 🎨 Supported Classes

| Icon | Class | Description |
|------|-------|-------------|
| 🕳️ | Pothole | Damaged road surface |
| ♻️ | Plastic | Plastic waste |
| 🗑️ | Other Litter | General garbage |

## 🔌 API Configuration

### Finding Your Computer IP

**Windows:**
```cmd
ipconfig
```
Look for "IPv4 Address" (e.g., 192.168.1.100)

**Mac/Linux:**
```bash
ifconfig | grep inet
```

### Updating the API URL

Edit `src/services/api.js`:
```javascript
const API_BASE_URL = 'http://YOUR_IP:8080/api';
```

Example:
```javascript
const API_BASE_URL = 'http://192.168.1.100:8080/api';
```

After changes, press **r** in terminal to reload the app.

## 📱 Device Setup

### Permissions Required
- ✅ Camera - For taking photos
- ✅ Photo Library - For selecting images

These are requested automatically by the app.

### Network Requirements
- 📡 Same WiFi as computer
- 🌐 Computer IP address (not localhost)
- ⚡ Both devices awake and connected

## 🐛 Troubleshooting

### "Connection Refused" Error
```
❌ Error: Cannot connect to API
✅ Solution:
  1. Check backend is running on :8080
  2. Use computer IP, not localhost
  3. Verify both on same WiFi
```

### "Camera Permission Denied"
```
❌ Error: Camera not accessible
✅ Solution:
  1. Go to Settings → Apps → Expo Go
  2. Enable Camera permission
  3. Restart Expo Go
```

### "Image Upload Failed"
```
❌ Error: Upload timeout
✅ Solution:
  1. Ensure YOLO API running on :5000
  2. Check image quality (try smaller image)
  3. Verify network speed
```

### QR Code Won't Scan
```
❌ Error: Cannot load app
✅ Solution:
  1. Restart Expo: Ctrl+C then npm start
  2. Make sure browser doesn't have tunnel enabled
  3. Try direct link method instead
```

## 🔍 How to Use

### Taking a Photo
1. Tap **📷 Take Photo** button
2. Allow camera access if prompted
3. Capture or retake photo
4. Tap **🔍 Detect Objects**

### Uploading from Gallery
1. Tap **🖼️ Choose Image** button
2. Allow photo library access if prompted
3. Select an image
4. Tap **🔍 Detect Objects**

### Viewing Results
- See object count by class
- Check confidence scores (0-100%)
- View detailed detection list
- Tap **↻ Reset** to analyze another image

## ⚙️ System Requirements

| Component | Requirement |
|-----------|-------------|
| Backend | Spring Boot on :8080 |
| YOLO API | Python Flask on :5000 |
| Database | MongoDB (Cloud or Local) |
| Network | Same WiFi network |
| Phone | iOS 12+ or Android 6+ |

## 📦 Commands

```bash
# Start dev server
npm start

# Start on Android emulator
npm run android

# Start on iOS simulator
npm run ios

# Start on web
npm run web

# Install dependencies
npm install

# Update dependencies
npm update
```

## 🎓 Learning More

- [Expo Documentation](https://docs.expo.dev)
- [React Native Docs](https://reactnative.dev)
- [Navigation Library](https://reactnavigation.org)
- [Axios Documentation](https://axios-http.com)

## 💡 Tips

- Use **landscape mode** for better image preview
- Enable **airplane mode** then turn on WiFi for best connection
- Keep app running while analyzing (don't minimize)
- Close other heavy apps for better performance

## 🔒 Security Notes

- Backend API URL is stored in code (for development)
- Never expose real credentials in source code
- Use HTTPS in production
- Validate file uploads on backend

## 📄 License

MIT License - Feel free to use and modify

---

**Happy Detecting! 🛣️📱**
