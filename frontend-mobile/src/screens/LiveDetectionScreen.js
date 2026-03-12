import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, Alert, Dimensions, Image } from 'react-native';
import { Button, Card, Title, Paragraph, ActivityIndicator } from 'react-native-paper';
import { Camera } from 'expo-camera';
import * as Location from 'expo-location';
import { API_BASE_URL } from '../services/api';
import { getCurrentLocation } from '../services/locationService';

/**
 * Save detection result to backend database
 */
async function savePotholeDetection(detectionResult, latitude, longitude) {
  try {
    if (!latitude || !longitude) {
      console.warn('⚠️ Location not available, skipping database save');
      return false;
    }

    const potholeData = {
      image: detectionResult.image || '',
      location: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
      latitude: latitude,
      longitude: longitude,
      severity: detectionResult.severity || 'Unknown',
      bbox: JSON.stringify(detectionResult.detections || []),
      timestamp: Date.now(),
    };

    console.log('💾 Saving live detection to database...');
    const response = await fetch(`${API_BASE_URL}/potholes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(potholeData),
    });

    if (response.ok) {
      const saved = await response.json();
      console.log('✅ Live detection saved to database:', saved.id);
      return true;
    } else {
      console.warn('⚠️ Failed to save live detection:', response.status);
      return false;
    }
  } catch (error) {
    console.error('❌ Error saving live detection:', error.message);
    return false;
  }
}

export default function LiveDetectionScreen() {
  const [hasPermission, setHasPermission] = useState(null);
  const [isLiveDetectionActive, setIsLiveDetectionActive] = useState(false);
  const [processedImage, setProcessedImage] = useState(null);
  const [detectionCount, setDetectionCount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    latency: 0,
    objectCount: 0,
  });
  const [cameraReady, setCameraReady] = useState(false);
  const cameraRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    (async () => {
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      const locationStatus = await Location.requestForegroundPermissionsAsync();
      setHasPermission(cameraStatus.status === 'granted' && locationStatus.status === 'granted');
    })();
  }, []);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Card style={styles.messageCard}>
          <Card.Content>
            <Title>Requesting Permissions...</Title>
            <Paragraph>Please wait while we request camera and location permissions</Paragraph>
            <ActivityIndicator style={styles.permissionButton} />
          </Card.Content>
        </Card>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Card style={styles.messageCard}>
          <Card.Content>
            <Title>Permission Denied</Title>
            <Paragraph>Camera and location permissions are required to use live detection</Paragraph>
            <Button mode="contained" style={styles.permissionButton}>
              Enable Permissions in Settings
            </Button>
          </Card.Content>
        </Card>
      </View>
    );
  }

  const captureAndDetect = async () => {
    if (!cameraRef.current || isProcessing || !cameraReady) {
      console.log('Camera not ready:', { camera: !!cameraRef.current, isProcessing, cameraReady });
      return;
    }

    setIsProcessing(true);
    const startTime = Date.now();

    try {
      // Get current device location
      console.log('📍 Capturing device location...');
      const location = await getCurrentLocation();

      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.7,
        base64: false,
      });

      const formData = new FormData();
      formData.append('file', {
        uri: photo.uri,
        type: 'image/jpeg',
        name: 'live_detection.jpg',
      });

      // Add location data to request
      if (location) {
        formData.append('latitude', location.latitude.toString());
        formData.append('longitude', location.longitude.toString());
        console.log(`📍 Sending location: ${location.latitude}, ${location.longitude}`);
      } else {
        console.warn('⚠️ Could not capture location, proceeding with detection only');
      }

      const response = await fetch(`${API_BASE_URL}/potholes/detect`, {
        method: 'POST',
        body: formData,
        timeout: 15000,
      });

      if (!response.ok) {
        const errMsg = `API error: ${response.status} ${response.statusText}`;
        console.error(errMsg);
        setError(errMsg);
        setIsProcessing(false);
        return;
      }

      const data = await response.json();
      const latency = Date.now() - startTime;

      console.log('Detection response:', { count: data.count, hasImage: !!data.image, latency });

      if (data.image) {
        setError(null);
        setProcessedImage(data.image);
        setDetectionCount(data.count || 0);
        setStats({
          latency: latency,
          objectCount: data.count || 0,
        });

        // Save detection to database if location is available and potholes detected
        if (location && data.count && data.count > 0) {
          console.log('💾 Saving live detection to database...');
          await savePotholeDetection(data, location.latitude, location.longitude);
        }
      } else {
        const errMsg = 'No image in response from API';
        console.warn(errMsg);
        setError(errMsg);
      }
    } catch (err) {
      const errMsg = `Live detection error: ${err.message}`;
      console.error(errMsg);
      setError(errMsg);
    } finally {
      setIsProcessing(false);
    }
  };

  const toggleLiveDetection = () => {
    setIsLiveDetectionActive(!isLiveDetectionActive);
    
    if (!isLiveDetectionActive) {
      // Start capturing frames every 1 second (with 500ms delay to let camera initialize)
      setError(null);
      setProcessedImage(null);
      setDetectionCount(0);
      
      // Wait for camera to be ready before starting detection
      setTimeout(() => {
        if (cameraReady && !isLiveDetectionActive) {
          intervalRef.current = setInterval(() => {
            captureAndDetect();
          }, 1000);
        }
      }, 500);
    } else {
      // Stop capturing frames
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
  };

  return (
    <View style={styles.container}>
      {/* Split Screen - Live Feed and Processed */}
      <View style={styles.splitContainer}>
        {/* Left/Top: Live Camera Feed */}
        <View style={styles.splitHalf}>
          <Camera 
            style={styles.camera} 
            ref={cameraRef}
            onCameraReady={() => setCameraReady(true)}
          />
          <View style={styles.feedLabel}>
            <Paragraph style={styles.feedLabelText}>📹 Live Feed</Paragraph>
          </View>
        </View>

        {/* Right/Bottom: Processed Image with Bounding Boxes */}
        <View style={styles.splitHalf}>
          {processedImage ? (
            <>
              <Image
                source={{ uri: `data:image/jpeg;base64,${processedImage}` }}
                style={styles.camera}
              />
              <View style={styles.feedLabel}>
                <Paragraph style={styles.feedLabelText}>🔍 Processed ({detectionCount})</Paragraph>
              </View>
            </>
          ) : (
            <View style={styles.emptyPlaceholder}>
              <Paragraph style={styles.placeholderText}>Waiting for detections...</Paragraph>
            </View>
          )}
        </View>
      </View>

      {/* Control Panel */}
      <View style={styles.controlPanel}>
        <Button
          mode={isLiveDetectionActive ? 'contained' : 'outlined'}
          onPress={toggleLiveDetection}
          icon={isLiveDetectionActive ? 'stop-circle' : 'play-circle'}
          style={styles.toggleButton}
          buttonColor={isLiveDetectionActive ? '#ef4444' : '#10b981'}
        >
          {isLiveDetectionActive ? 'Stop Detection' : 'Start Detection'}
        </Button>

        {error && (
          <Card style={styles.errorCard}>
            <Card.Content>
              <Paragraph style={styles.errorText}>⚠️ {error}</Paragraph>
            </Card.Content>
          </Card>
        )}

        {isLiveDetectionActive && isProcessing && (
          <View style={styles.processingIndicator}>
            <ActivityIndicator animating={true} size="small" color="#667eea" />
            <Paragraph style={styles.processingText}>Processing...</Paragraph>
          </View>
        )}

        {isLiveDetectionActive && (
          <Card style={styles.statsCard}>
            <Card.Content>
              <View style={styles.statRow}>
                <Paragraph style={styles.statLabel}>Objects Detected:</Paragraph>
                <Paragraph style={styles.statValue}>{stats.objectCount}</Paragraph>
              </View>
              <View style={styles.statRow}>
                <Paragraph style={styles.statLabel}>Latency:</Paragraph>
                <Paragraph style={styles.statValue}>{stats.latency}ms</Paragraph>
              </View>
            </Card.Content>
          </Card>
        )}
      </View>
    </View>
  );
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  splitContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  splitHalf: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
    width: '100%',
  },
  feedLabel: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  feedLabelText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
  },
  emptyPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
  },
  placeholderText: {
    color: '#888',
    fontSize: 12,
  },
  controlPanel: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f8f9fa',
    maxHeight: '30%',
  },
  toggleButton: {
    marginBottom: 12,
    paddingVertical: 6,
  },
  errorCard: {
    backgroundColor: '#fee2e2',
    marginBottom: 10,
  },
  errorText: {
    color: '#991b1b',
    fontSize: 12,
  },
  processingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  processingText: {
    marginLeft: 8,
    color: '#667eea',
    fontSize: 12,
    fontWeight: 'bold',
  },
  statsCard: {
    backgroundColor: '#fff',
    elevation: 2,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  statValue: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#667eea',
  },
  messageCard: {
    marginHorizontal: 16,
    marginTop: 40,
  },
  permissionButton: {
    marginTop: 12,
  },
});
