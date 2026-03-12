import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Alert, Image } from 'react-native';
import { Button, Card, Title, Paragraph, ActivityIndicator } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import * as VideoThumbnails from 'expo-video-thumbnails';
import { Video } from 'expo-av';
import { API_BASE_URL } from '../services/api';
import { getCurrentLocation } from '../services/locationService';

/**
 * Save detection result to backend database
 */
async function savePotholeDetection(detectionResult, latitude, longitude, isVideo = false) {
  try {
    if (!latitude || !longitude) {
      console.warn('⚠️ Location not available, skipping database save');
      return false;
    }

    const potholeData = {
      image: detectionResult.image || detectionResult.videoUrl || '',
      location: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
      latitude: latitude,
      longitude: longitude,
      severity: detectionResult.severity || 'Unknown',
      bbox: JSON.stringify(detectionResult.detections || []),
      timestamp: Date.now(),
    };

    console.log('💾 Saving ' + (isVideo ? 'video' : 'image') + ' detection to database...');
    const response = await fetch(`${API_BASE_URL}/potholes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(potholeData),
    });

    if (response.ok) {
      const saved = await response.json();
      console.log('✅ Detection saved to database:', saved.id);
      return true;
    } else {
      console.warn('⚠️ Failed to save detection:', response.status);
      return false;
    }
  } catch (error) {
    console.error('❌ Error saving detection:', error.message);
    return false;
  }
}

export default function VideoDetectionScreen() {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [processedFrames, setProcessedFrames] = useState([]);
  const [error, setError] = useState(null);

  const pickVideoFromGallery = async () => {
    try {
      let pickerResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: false,
        quality: 0.8,
      });

      if (!pickerResult.canceled) {
        setSelectedVideo(pickerResult.assets[0]);
        setResult(null);
      }
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  };

  const recordVideo = async () => {
    try {
      let pickerResult = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: false,
        quality: 0.8,
      });

      if (!pickerResult.canceled) {
        setSelectedVideo(pickerResult.assets[0]);
        setResult(null);
      }
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  };

  const handleProcessVideo = async () => {
    if (!selectedVideo) {
      Alert.alert('Error', 'Please select a video');
      return;
    }

    setIsLoading(true);
    setError(null);
    setProcessedFrames([]);

    try {
      // Get current device location
      console.log('📍 Capturing device location...');
      const location = await getCurrentLocation();

      const formData = new FormData();
      
      // For React Native, we need to handle file upload properly
      // Create a proper file object for the FormData
      formData.append('file', {
        uri: selectedVideo.uri,
        type: 'video/mp4',
        name: selectedVideo.filename || 'video.mp4',
      });

      // Add location data to request
      if (location) {
        formData.append('latitude', location.latitude.toString());
        formData.append('longitude', location.longitude.toString());
        console.log(`📍 Sending location: ${location.latitude}, ${location.longitude}`);
      } else {
        console.warn('⚠️ Could not capture location, proceeding with video detection only');
      }

      console.log('Video details:', {
        uri: selectedVideo.uri,
        filename: selectedVideo.filename,
      });
      console.log(`Sending video to: ${API_BASE_URL}/potholes/detect-video`);

      const response = await fetch(`${API_BASE_URL}/potholes/detect-video`, {
        method: 'POST',
        body: formData,
        timeout: 3600000, // 1 hour timeout for video processing
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Backend error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Backend response:', data);

      if (!data.success) {
        throw new Error(data.message || 'Video processing failed');
      }

      // Construct full video URL using API_BASE_URL
      let videoUrl = data.videoUrl || data.videoPath;
      if (videoUrl && !videoUrl.startsWith('http')) {
        videoUrl = `${API_BASE_URL}${videoUrl}`;
      }
      
      console.log('Using video URL:', videoUrl);
      
      setResult({
        framesAnalyzed: 'Full Video',
        framesProcessed: 'All Frames',
        duration: selectedVideo.duration ? `${(selectedVideo.duration / 1000).toFixed(2)}s` : 'Unknown',
        totalObjects: 'Processing Complete',
        videoUrl: videoUrl,  // Store as videoUrl to match the video player check
        videoPath: videoUrl, // Keep for backward compatibility
      });

      // Store one frame as thumbnail for display
      setProcessedFrames([{
        id: 0,
        time: 'Full Video',
        videoPath: videoUrl,
        count: '✓',
        detections: [],
      }]);

      setIsLoading(false);
      
      // Save detection to database if location is available
      if (location && data) {
        console.log('💾 Saving video detection to database...');
        await savePotholeDetection(data, location.latitude, location.longitude, true);
      }
      
      Alert.alert('Success', `Video processing complete!\n📍 Location recorded`);

    } catch (err) {
      const errMsg = err.message || 'Video processing failed';
      setError(errMsg);
      setIsLoading(false);
      Alert.alert('Error', 'Video processing failed: ' + errMsg);
      console.error('Video processing error:', err);
    }
  };

  const handleReset = () => {
    setSelectedVideo(null);
    setResult(null);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Title style={styles.headerTitle}>🎥 Video Detection</Title>
        <Paragraph style={styles.headerDesc}>
          Upload or record videos for road damage detection
        </Paragraph>
      </View>

      {/* Video Preview */}
      <Card style={styles.videoCard}>
        {selectedVideo ? (
          <>
            <Video
              source={{ uri: selectedVideo.uri }}
              rate={1.0}
              volume={1.0}
              isMuted={false}
              resizeMode="contain"
              useNativeControls
              style={styles.videoPlayer}
            />
            <Card.Content>
              <Paragraph style={styles.videoName}>
                📹 {selectedVideo.filename || selectedVideo.uri.split('/').pop()}
              </Paragraph>
              <Paragraph style={styles.videoInfo}>
                Duration: {selectedVideo.duration ? `${(selectedVideo.duration / 1000).toFixed(1)}s` : 'Unknown'}
              </Paragraph>
            </Card.Content>
          </>
        ) : (
          <View style={styles.videoPlaceholder}>
            <Paragraph style={styles.noVideoText}>No video selected</Paragraph>
          </View>
        )}
      </Card>

      {/* Action Buttons */}
      <View style={styles.buttonGroup}>
        <Button
          mode="contained"
          onPress={recordVideo}
          icon="record"
          style={styles.halfButton}
        >
          Record
        </Button>
        <Button
          mode="contained"
          onPress={pickVideoFromGallery}
          icon="folder-open"
          style={styles.halfButton}
        >
          Gallery
        </Button>
      </View>

      {/* Process Button */}
      {selectedVideo && !isLoading && (
        <Button
          mode="contained"
          onPress={handleProcessVideo}
          icon="play-circle"
          style={styles.processButton}
          buttonColor="#2563eb"
        >
          Process Video
        </Button>
      )}

      {/* Loading */}
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator animating={true} size="large" color="#2563eb" />
          <Paragraph style={styles.loadingText}>Processing video...</Paragraph>
        </View>
      )}

      {/* Results */}
      {result && !isLoading && (
        <>
          {error && (
            <Card style={styles.errorCard}>
              <Card.Content>
                <Paragraph style={styles.errorText}>⚠️ {error}</Paragraph>
              </Card.Content>
            </Card>
          )}

          <Card style={styles.statsCard}>
            <Card.Title title="Video Analysis Results" />
            <Card.Content>
              <View style={styles.statRow}>
                <Paragraph style={styles.statLabel}>Total Frames Extracted:</Paragraph>
                <Paragraph style={styles.statValue}>{result.framesAnalyzed}</Paragraph>
              </View>
              <View style={styles.statRow}>
                <Paragraph style={styles.statLabel}>Frames Processed:</Paragraph>
                <Paragraph style={styles.statValue}>{result.framesProcessed}</Paragraph>
              </View>
              <View style={styles.statRow}>
                <Paragraph style={styles.statLabel}>Video Duration:</Paragraph>
                <Paragraph style={styles.statValue}>{result.duration}</Paragraph>
              </View>
              <View style={styles.statRow}>
                <Paragraph style={styles.statLabel}>Total Objects Detected:</Paragraph>
                <Paragraph style={styles.statValue}>{result.totalObjects}</Paragraph>
              </View>
            </Card.Content>
          </Card>

          {processedFrames.length > 0 || result?.videoUrl ? (
            <>
              <Card style={styles.framesCard}>
                <Card.Title title="🎥 Processed Video with Detections" />
                <Card.Content>
                  <Paragraph style={styles.framesDesc}>
                    Full video processed with YOLO detection and bounding boxes drawn:
                  </Paragraph>
                  
                  {result?.videoUrl ? (
                    <View style={styles.processedVideoContainer}>
                      <Video
                        source={{ uri: result.videoUrl }}
                        rate={1.0}
                        volume={1.0}
                        isMuted={false}
                        resizeMode="contain"
                        useNativeControls
                        style={styles.processedVideoPlayer}
                      />
                      <Paragraph style={styles.videoPathText}>
                        ✓ Video processed and ready to play
                      </Paragraph>
                    </View>
                  ) : (
                    <View style={styles.loadingContainer}>
                      <Paragraph style={styles.loadingText}>
                        Processing your video... This may take several minutes depending on video length.
                      </Paragraph>
                    </View>
                  )}
                </Card.Content>
              </Card>
            </>
          ) : null}

          <Button
            mode="outlined"
            onPress={handleReset}
            icon="refresh"
            style={styles.resetButton}
          >
            Reset
          </Button>
        </>
      )}

      {/* Info Box */}
      <Card style={styles.infoCard}>
        <Card.Title title="ℹ️ Video Requirements" />
        <Card.Content>
          <Paragraph style={styles.infoText}>
            • Supported formats: MP4, MOV, AVI{'\n'}
            • Max file size: 500MB{'\n'}
            • Recommended resolution: 720p or higher{'\n'}
            • Processing time varies by length
          </Paragraph>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 12,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  headerDesc: {
    fontSize: 13,
    color: '#666',
    marginTop: 4,
  },
  videoCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    elevation: 2,
    overflow: 'hidden',
  },
  videoPlayer: {
    width: '100%',
    height: 300,
    backgroundColor: '#000',
  },
  videoPlaceholder: {
    width: '100%',
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f5',
  },
  videoName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  videoInfo: {
    fontSize: 12,
    color: '#666',
    marginTop: 8,
  },
  noVideoText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  buttonGroup: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 12,
  },
  halfButton: {
    flex: 1,
  },
  processButton: {
    marginHorizontal: 16,
    marginBottom: 16,
    paddingVertical: 6,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 12,
    color: '#2563eb',
  },
  statsCard: {
    marginHorizontal: 16,
    marginBottom: 12,
    elevation: 2,
  },
  resultVideoCard: {
    marginHorizontal: 16,
    marginBottom: 12,
    elevation: 2,
    overflow: 'hidden',
  },
  resultVideoPlayer: {
    width: '100%',
    height: 300,
    backgroundColor: '#000',
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  statLabel: {
    fontSize: 13,
    color: '#666',
  },
  statValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2563eb',
  },
  detectionCard: {
    marginHorizontal: 16,
    marginBottom: 12,
    elevation: 2,
  },
  detectionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  detectionClass: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
  },
  detectionFrame: {
    fontSize: 11,
    color: '#999',
    marginTop: 2,
  },
  detectionConfidence: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#10b981',
  },
  resetButton: {
    marginHorizontal: 16,
    marginBottom: 20,
    borderColor: '#ef4444',
  },
  infoCard: {
    marginHorizontal: 16,
    marginBottom: 20,
    elevation: 2,
  },
  infoText: {
    fontSize: 12,
    color: '#666',
    lineHeight: 20,
  },
  errorCard: {
    marginHorizontal: 16,
    marginBottom: 12,
    backgroundColor: '#fee2e2',
  },
  errorText: {
    color: '#991b1b',
    fontSize: 12,
  },
  infoMessageCard: {
    marginHorizontal: 16,
    marginBottom: 12,
    backgroundColor: '#dbeafe',
  },
  infoMessageText: {
    color: '#1e40af',
    fontSize: 12,
    lineHeight: 18,
  },
  noteCard: {
    marginHorizontal: 16,
    marginBottom: 12,
    elevation: 2,
    backgroundColor: '#f0fdf4',
  },
  noteTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#15803d',
    marginBottom: 8,
  },
  noteText: {
    fontSize: 11,
    color: '#166534',
    lineHeight: 18,
  },
  framesCard: {
    marginHorizontal: 16,
    marginBottom: 12,
    elevation: 2,
  },
  framesDesc: {
    fontSize: 12,
    color: '#666',
    marginBottom: 12,
  },
  framesListContainer: {
    gap: 12,
  },
  frameContainerWrapper: {
    position: 'relative',
  },
  frameIndexBadge: {
    position: 'absolute',
    top: -8,
    left: 12,
    backgroundColor: '#2563eb',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  frameIndexText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
  },
  frameWrapper: {
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  frameImage: {
    width: '100%',
    height: 180,
    backgroundColor: '#000',
  },
  frameInfoBar: {
    padding: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  frameTime: {
    fontSize: 11,
    color: '#666',
    fontWeight: '500',
  },
  frameCount: {
    fontSize: 11,
    color: '#2563eb',
    fontWeight: 'bold',
  },
  frameContainer: {
    marginVertical: 8,
  },
  frameInfo: {
    padding: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  noFramePlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f5',
  },
  noFrameText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 12,
    paddingHorizontal: 16,
  },
  emptyFramesCard: {
    marginHorizontal: 16,
    marginBottom: 12,
    elevation: 2,
    backgroundColor: '#dbeafe',
  },
  emptyFramesText: {
    color: '#1e40af',
    fontSize: 13,
  },
  processedVideoContainer: {
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#000',
    elevation: 3,
  },
  processedVideoPlayer: {
    width: '100%',
    height: 300,
    backgroundColor: '#000',
  },
  videoPathText: {
    padding: 12,
    backgroundColor: '#f0fdf4',
    color: '#15803d',
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '600',
  },
});
