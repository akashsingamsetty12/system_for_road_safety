import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Image, Alert } from 'react-native';
import { Button, Card, Title, Paragraph, ActivityIndicator, SegmentedButtons, Chip } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { API_BASE_URL } from '../services/api';
import { getCurrentLocation } from '../services/locationService';

const getConfidenceColor = (confidence) => {
  if (!confidence) return '#ccc';
  if (confidence > 0.8) return '#10b981';
  if (confidence > 0.6) return '#f59e0b';
  return '#ef4444';
};

const getSeverityLevel = (avgConfidence) => {
  if (avgConfidence > 0.8) return { level: 'Critical', color: '#dc2626' };
  if (avgConfidence > 0.6) return { level: 'High', color: '#ea580c' };
  if (avgConfidence > 0.4) return { level: 'Medium', color: '#f59e0b' };
  return { level: 'Low', color: '#10b981' };
};

const calculateDetectionStats = (detections) => {
  if (!detections || detections.length === 0) return null;
  
  const stats = {};
  detections.forEach(detection => {
    const className = detection.class || 'Unknown';
    stats[className] = (stats[className] || 0) + 1;
  });
  
  const avgConfidence = detections.reduce((sum, d) => sum + (d.confidence || 0), 0) / detections.length;
  return { byClass: stats, avgConfidence };
};

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

    console.log('💾 Saving pothole detection to database...');
    const response = await fetch(`${API_BASE_URL}/potholes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(potholeData),
    });

    if (response.ok) {
      const saved = await response.json();
      console.log('✅ Pothole saved to database:', saved.id);
      return true;
    } else {
      console.warn('⚠️ Failed to save pothole:', response.status);
      return false;
    }
  } catch (error) {
    console.error('❌ Error saving pothole:', error.message);
    return false;
  }
}

export default function ImageDetectionScreen() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [imageSource, setImageSource] = useState('camera');

  const pickImage = async () => {
    try {
      let pickerResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 0.8,
      });

      if (!pickerResult.canceled) {
        setSelectedImage(pickerResult.assets[0].uri);
        setResult(null);
        Alert.alert('Success', 'Image selected. Tap "Detect" to analyze', [{ text: 'OK' }], { cancelable: false });
      }
    } catch (err) {
      Alert.alert('Gallery Error', 'Failed to select image: ' + err.message);
    }
  };

  const takePhoto = async () => {
    try {
      let pickerResult = await ImagePicker.launchCameraAsync({
        allowsEditing: false,
        quality: 0.8,
      });

      if (!pickerResult.canceled) {
        setSelectedImage(pickerResult.assets[0].uri);
        setResult(null);
        Alert.alert('Success', 'Photo captured. Tap "Detect" to analyze', [{ text: 'OK' }], { cancelable: false });
      }
    } catch (err) {
      Alert.alert('Camera Error', 'Failed to capture photo: ' + err.message);
    }
  };

  const handleDetect = async () => {
    if (!selectedImage) {
      Alert.alert('[WARNING] No Image Selected', 'Please capture or upload a photo first', [{ text: 'OK' }]);
      return;
    }

    setIsLoading(true);
    const timeoutId = setTimeout(() => {
      setIsLoading(false);
      Alert.alert('[TIMEOUT] Detection Timeout', `The backend server is taking too long to respond.\n\nBackend: ${API_BASE_URL}`, [{ text: 'OK' }]);
    }, 30000);

    try {
      console.log('[LOCATION] Capturing device location...');
      const location = await getCurrentLocation();
      
      const formData = new FormData();
      formData.append('file', {
        uri: selectedImage,
        type: 'image/jpeg',
        name: 'detection.jpg',
      });
      
      if (location) {
        formData.append('latitude', location.latitude.toString());
        formData.append('longitude', location.longitude.toString());
        console.log(`[LOCATION] Sending location: ${location.latitude}, ${location.longitude}`);
      } else {
        console.warn('[WARNING] Could not capture location, proceeding with detection only');
      }

      console.log(`[DETECT] Uploading image to: ${API_BASE_URL}/potholes/detect`);
      const response = await fetch(`${API_BASE_URL}/potholes/detect`, {
        method: 'POST',
        body: formData,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Server error ${response.status}: Please try again`);
      }

      const data = await response.json();
      setResult(data);
      
      // Database save removed for instant results
      // (MongoDB disabled on backend)
      
      Alert.alert('[SUCCESS] Detection Complete', `Found ${data.count || 0} object(s)\nProcessing time: ${data.processing_time_seconds || 0}s`, [{ text: 'OK' }], { cancelable: false });
    } catch (err) {
      clearTimeout(timeoutId);
      Alert.alert('❌ Detection Failed', err.message || 'Unknown error occurred. Try again.', [{ text: 'OK' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedImage(null);
    setResult(null);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Title style={styles.headerTitle}>Image Detection</Title>
        <Paragraph style={styles.headerDesc}>
          Detect road damage, potholes, and litter in seconds
        </Paragraph>
        <View style={styles.stepIndicator}>
          <Chip style={styles.activeStep}>1. Capture</Chip>
          <Paragraph style={styles.arrow}>→</Paragraph>
          <Chip>2. Analyze</Chip>
          <Paragraph style={styles.arrow}>→</Paragraph>
          <Chip>3. View Results</Chip>
        </View>
      </View>

      {/* Image Preview */}
      <Card style={styles.imageCard}>
        {selectedImage ? (
          <Image source={{ uri: selectedImage }} style={styles.image} />
        ) : (
          <View style={styles.placeholder}>
            <Paragraph style={styles.placeholderText}>No image selected</Paragraph>
          </View>
        )}
      </Card>

      {/* Action Buttons */}
      <View style={styles.buttonGroup}>
        <Button
          mode="contained"
          onPress={takePhoto}
          icon="camera"
          style={styles.halfButton}
        >
          Camera
        </Button>
        <Button
          mode="contained"
          onPress={pickImage}
          icon="image"
          style={styles.halfButton}
        >
          Gallery
        </Button>
      </View>

      {/* Detect Button */}
      {selectedImage && !isLoading && (
        <Button
          mode="contained"
          onPress={handleDetect}
          icon="magnify"
          style={styles.detectButton}
          buttonColor="#10b981"
        >
          Detect
        </Button>
      )}

      {/* Loading */}
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator animating={true} size="large" color="#667eea" />
          <Paragraph style={styles.loadingText}>Analyzing image...</Paragraph>
        </View>
      )}

      {/* Results */}
      {result && !isLoading && (
        <>
          {result.image && (
            <>
              {/* Detected Image */}
              <Card style={styles.resultCard}>
                <Card.Title 
                  title="Detection Result" 
                  subtitle={`${result.count || 0} Object(s) Detected`}
                />
                <Card.Content>
                  <Image 
                    source={{ uri: `data:image/jpeg;base64,${result.image}` }} 
                    style={styles.resultImage}
                  />
                </Card.Content>
              </Card>

              {/* Summary Stats */}
              <Card style={styles.statsCard}>
                <Card.Content>
                  <Title style={styles.statsTitle}>Detection Summary</Title>
                  
                  <View style={styles.statRow}>
                    <Paragraph style={styles.statLabel}>Total Detections:</Paragraph>
                    <Paragraph style={styles.statValue}>{result.count || 0}</Paragraph>
                  </View>

                  <View style={styles.statRow}>
                    <Paragraph style={styles.statLabel}>Processing Time:</Paragraph>
                    <Paragraph style={styles.statValue}>{result.processing_time_seconds || 0}s</Paragraph>
                  </View>

                  <View style={styles.statRow}>
                    <Paragraph style={styles.statLabel}>Image Dimensions:</Paragraph>
                    <Paragraph style={styles.statValue}>{result.width}x{result.height}px</Paragraph>
                  </View>

                  {result.detections && result.detections.length > 0 && (() => {
                    const stats = calculateDetectionStats(result.detections);
                    const severity = getSeverityLevel(stats.avgConfidence);
                    return (
                      <>
                        <View style={styles.severityRow}>
                          <Paragraph style={styles.statLabel}>Overall Severity:</Paragraph>
                          <Chip 
                            style={[styles.severityChip, { backgroundColor: severity.color }]}
                            textStyle={{ color: '#fff', fontWeight: 'bold' }}
                          >
                            {severity.level}
                          </Chip>
                        </View>
                        
                        <View style={styles.statRow}>
                          <Paragraph style={styles.statLabel}>Avg Confidence:</Paragraph>
                          <Paragraph style={styles.statValue}>{(stats.avgConfidence * 100).toFixed(1)}%</Paragraph>
                        </View>
                      </>
                    );
                  })()}
                </Card.Content>
              </Card>

              {/* Detection by Class */}
              {result.detections && result.detections.length > 0 && (() => {
                const stats = calculateDetectionStats(result.detections);
                return (
                  <Card style={styles.classCard}>
                    <Card.Content>
                      <Title style={styles.statsTitle}>Detected Classes</Title>
                      {Object.entries(stats.byClass).map(([className, count], idx) => (
                        <View key={idx} style={styles.classItem}>
                          <Paragraph style={styles.className}>{className}</Paragraph>
                          <Chip style={{ backgroundColor: '#667eea' }} textStyle={{ color: '#fff' }}>
                            {count}x
                          </Chip>
                        </View>
                      ))}
                    </Card.Content>
                  </Card>
                );
              })()}

              {/* Detailed Detections */}
              {result.detections && result.detections.length > 0 && (
                <Card style={styles.detailedCard}>
                  <Card.Content>
                    <Title style={styles.statsTitle}>Detailed Detections</Title>
                    
                    {result.detections.map((detection, idx) => (
                      <View key={idx} style={styles.detectionDetailCard}>
                        <View style={styles.detectionHeader}>
                          <View>
                            <Paragraph style={styles.detectionIndex}>Detection #{idx + 1}</Paragraph>
                            <Paragraph style={styles.detectionClass}>
                              {detection.class || `Object ${idx + 1}`}
                            </Paragraph>
                          </View>
                          <Paragraph style={[
                            styles.confidencePercent,
                            { color: getConfidenceColor(detection.confidence) }
                          ]}>
                            {detection.confidence ? `${Math.round(detection.confidence * 100)}%` : 'N/A'}
                          </Paragraph>
                        </View>

                        <View style={[styles.confidenceBarContainer, { 
                          backgroundColor: getConfidenceColor(detection.confidence) 
                        }]}>
                          <View style={styles.confidenceBarFill} />
                        </View>

                        {/* Bounding Box Coordinates */}
                        <View style={styles.coordContainer}>
                          <View style={styles.coordRow}>
                            <Paragraph style={styles.coordLabel}>X:</Paragraph>
                            <Paragraph style={styles.coordValue}>{detection.x1?.toFixed(0)} → {detection.x2?.toFixed(0)}</Paragraph>
                          </View>
                          <View style={styles.coordRow}>
                            <Paragraph style={styles.coordLabel}>Y:</Paragraph>
                            <Paragraph style={styles.coordValue}>{detection.y1?.toFixed(0)} → {detection.y2?.toFixed(0)}</Paragraph>
                          </View>
                          <View style={styles.coordRow}>
                            <Paragraph style={styles.coordLabel}>Class ID:</Paragraph>
                            <Paragraph style={styles.coordValue}>{detection.class_id || 'N/A'}</Paragraph>
                          </View>
                        </View>
                      </View>
                    ))}
                  </Card.Content>
                </Card>
              )}
            </>
          )}

          <View style={styles.resultButtonGroup}>
            <Button
              mode="contained"
              onPress={handleReset}
              icon="refresh"
              style={styles.flexButton}
              buttonColor="#667eea"
            >
              New Detection
            </Button>
            <Button
              mode="outlined"
              icon="share-variant"
              style={styles.flexButton}
              onPress={() => Alert.alert('Share', 'Sharing detected image...')}
            >
              Share
            </Button>
          </View>
        </>
      )}
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
  imageCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    elevation: 2,
  },
  image: {
    width: '100%',
    height: undefined,
    aspectRatio: 1,
    resizeMode: 'contain',
  },
  placeholder: {
    width: '100%',
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f5',
  },
  placeholderText: {
    color: '#999',
    fontSize: 14,
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
  detectButton: {
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
    color: '#667eea',
  },
  resultCard: {
    marginHorizontal: 16,
    marginBottom: 12,
    elevation: 2,
  },
  resultImage: {
    width: '100%',
    height: undefined,
    aspectRatio: 1,
    resizeMode: 'contain',
  },

  // New styles for enhanced results
  statsCard: {
    marginHorizontal: 16,
    marginBottom: 12,
    backgroundColor: '#f0f4ff',
    elevation: 2,
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e4ff',
  },
  statLabel: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
  },
  statValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#667eea',
  },
  severityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderTopWidth: 2,
    borderTopColor: '#e0e4ff',
    marginTop: 4,
  },
  severityChip: {
    paddingHorizontal: 12,
    paddingVertical: 4,
  },

  // Class statistics card
  classCard: {
    marginHorizontal: 16,
    marginBottom: 12,
    elevation: 2,
  },
  classItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  className: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    flex: 1,
  },

  // Detailed detections
  detailedCard: {
    marginHorizontal: 16,
    marginBottom: 12,
    elevation: 2,
  },
  detectionDetailCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#667eea',
  },
  detectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  detectionIndex: {
    fontSize: 11,
    color: '#999',
    fontWeight: '500',
  },
  detectionClass: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 2,
  },
  confidencePercent: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  confidenceBarContainer: {
    height: 8,
    borderRadius: 4,
    marginBottom: 10,
    opacity: 0.3,
  },
  confidenceBarFill: {
    height: '100%',
    backgroundColor: '#667eea',
    borderRadius: 4,
  },
  coordContainer: {
    backgroundColor: '#f5f5f5',
    borderRadius: 6,
    padding: 10,
    marginTop: 8,
  },
  coordRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  coordLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    width: 40,
  },
  coordValue: {
    fontSize: 12,
    color: '#333',
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
  },

  resultButtonGroup: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 20,
  },
  flexButton: {
    flex: 1,
  },
  stepIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    gap: 4,
  },
  activeStep: {
    backgroundColor: '#667eea',
  },
  arrow: {
    color: '#999',
    fontSize: 12,
    marginHorizontal: 2,
  },
});
