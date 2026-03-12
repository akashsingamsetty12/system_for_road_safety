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

const getObjectSeverity = (confidence) => {
  // Priority based on confidence score
  if (confidence > 0.7) {
    return { severity: 'High Priority', color: '#ef4444' };
  } else if (confidence >= 0.5) {
    return { severity: 'Medium Priority', color: '#f59e0b' };
  } else {
    return { severity: 'Least Priority', color: '#eab308' };
  }
};

const getSeverityColor = (className) => {
  const colorMap = {
    'pothole': '#ef4444',
    'plastic': '#f59e0b',
    'litter': '#eab308',
    'other litter': '#eab308',
  };
  return colorMap[className?.toLowerCase()] || '#6b7280';
};

// Database saving disabled for faster response time
// Results are displayed locally only

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
      Alert.alert('⚠️ No Image Selected', 'Please capture or upload a photo first', [{ text: 'OK' }]);
      return;
    }

    setIsLoading(true);
    const timeoutId = setTimeout(() => {
      setIsLoading(false);
      Alert.alert('⏱️ Detection Timeout', `The backend server is taking too long to respond.\n\nBackend: ${API_BASE_URL}\n\nMake sure:\n• Backend server is running\n• Device has internet connection\n• API URL is correct`, [{ text: 'OK' }]);
    }, 30000);

    try {
      const formData = new FormData();
      formData.append('file', {
        uri: selectedImage,
        type: 'image/jpeg',
        name: 'detection.jpg',
      });

      console.log(`Uploading image for detection...`);
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
      
      // Show results immediately
      Alert.alert('Detection Complete', `Found ${data.count || 0} object(s)`, [{ text: 'OK' }], { cancelable: false });
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
        <Title style={styles.headerTitle}>📷 Image Detection</Title>
        <Paragraph style={styles.headerDesc}>
          Detect road damage, potholes, and litter in seconds
        </Paragraph>
        <View style={styles.stepIndicator}>
          <Chip style={styles.activeStep}>1️⃣ Capture</Chip>
          <Paragraph style={styles.arrow}>→</Paragraph>
          <Chip>2️⃣ Analyze</Chip>
          <Paragraph style={styles.arrow}>→</Paragraph>
          <Chip>3️⃣ View Results</Chip>
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
                  title="Detection Results" 
                  subtitle={`${result.count || 0} object(s) detected`}
                />
                <Card.Content>
                  <Image 
                    source={{ uri: `data:image/jpeg;base64,${result.image}` }} 
                    style={styles.resultImage}
                  />
                </Card.Content>
              </Card>

              {/* Analysis Summary */}
              <Card style={styles.analysisCard}>
                <Card.Title title="Analysis Summary" />
                <Card.Content>
                  <View style={styles.summaryGrid}>
                    <View style={styles.summaryItem}>
                      <Paragraph style={styles.summaryLabel}>Total Objects</Paragraph>
                      <Title style={styles.summaryValue}>{result.count || 0}</Title>
                    </View>
                    <View style={styles.summaryItem}>
                      <Paragraph style={styles.summaryLabel}>Image Size</Paragraph>
                      <Paragraph style={styles.summaryValue}>
                        {result.width && result.height ? `${result.width}x${result.height}` : 'N/A'}
                      </Paragraph>
                    </View>
                    <View style={styles.summaryItem}>
                      <Paragraph style={styles.summaryLabel}>Processing</Paragraph>
                      <Paragraph style={styles.summaryValue}>
                        {result.time_taken ? `${result.time_taken}s` : 'Complete'}
                      </Paragraph>
                    </View>
                  </View>
                </Card.Content>
              </Card>

              {/* Detection Details */}
              {result.detections && result.detections.length > 0 && (
                <Card style={styles.detailsCard}>
                  <Card.Title title="Detected Objects" />
                  <Card.Content>
                    {result.detections.map((detection, idx) => {
                      const severity = getObjectSeverity(detection.confidence);
                      const confidencePercent = Math.round((detection.confidence || 0) * 100);
                      
                      // Calculate additional feature values
                      const boxWidth = detection.x2 - detection.x1;
                      const boxHeight = detection.y2 - detection.y1;
                      const area = Math.round(boxWidth * boxHeight);
                      const aspectRatio = (boxWidth / boxHeight).toFixed(2);
                      const centerX = Math.round((detection.x1 + detection.x2) / 2);
                      const centerY = Math.round((detection.y1 + detection.y2) / 2);
                      const boxSizePercent = ((area / (result.width * result.height)) * 100).toFixed(2);
                      
                      return (
                        <View key={idx} style={styles.detectionItemContainer}>
                          {/* Severity Badge + Class Name + ID */}
                          <View style={styles.detectionHeader}>
                            <View style={[styles.severityBadge, { backgroundColor: severity.color }]}>
                              <Paragraph style={styles.severityText}>{severity.severity}</Paragraph>
                            </View>
                            <View style={styles.classInfoColumn}>
                              <Title style={styles.detectionClassName}>
                                {detection.class || `Object ${idx + 1}`}
                              </Title>
                              <Paragraph style={styles.classIdText}>ID: {detection.class_id || idx}</Paragraph>
                            </View>
                          </View>

                          {/* Confidence Score Section */}
                          <View style={styles.confidenceSection}>
                            <View style={styles.confidenceHeader}>
                              <Paragraph style={styles.confidenceLabel}>Confidence Score</Paragraph>
                              <Paragraph style={[styles.confidencePercent, { color: getConfidenceColor(detection.confidence) }]}>
                                {confidencePercent}%
                              </Paragraph>
                            </View>
                            <View style={styles.confidenceBarContainer}>
                              <View 
                                style={[
                                  styles.confidenceBarFill, 
                                  { 
                                    width: `${confidencePercent}%`,
                                    backgroundColor: getConfidenceColor(detection.confidence)
                                  }
                                ]} 
                              />
                            </View>
                          </View>

                          {/* Feature Values Grid */}
                          <View style={styles.featureGrid}>
                            {/* Bounding Box Coordinates */}
                            <View style={styles.featureCard}>
                              <Paragraph style={styles.featureLabel}>Bounding Box</Paragraph>
                              <View style={styles.featureContent}>
                                <Paragraph style={styles.featureValue}>↖️ ({Math.round(detection.x1)}, {Math.round(detection.y1)})</Paragraph>
                                <Paragraph style={styles.featureValue}>↙️ ({Math.round(detection.x2)}, {Math.round(detection.y2)})</Paragraph>
                              </View>
                            </View>

                            {/* Size Information */}
                            <View style={styles.featureCard}>
                              <Paragraph style={styles.featureLabel}>Dimensions</Paragraph>
                              <View style={styles.featureContent}>
                                <Paragraph style={styles.featureValue}>Width: {Math.round(boxWidth)}px</Paragraph>
                                <Paragraph style={styles.featureValue}>Height: {Math.round(boxHeight)}px</Paragraph>
                              </View>
                            </View>

                            {/* Area & Ratio */}
                            <View style={styles.featureCard}>
                              <Paragraph style={styles.featureLabel}>Area Analysis</Paragraph>
                              <View style={styles.featureContent}>
                                <Paragraph style={styles.featureValue}>Area: {area} px²</Paragraph>
                                <Paragraph style={styles.featureValue}>Ratio: {boxSizePercent}% of image</Paragraph>
                              </View>
                            </View>

                            {/* Aspect Ratio & Center */}
                            <View style={styles.featureCard}>
                              <Paragraph style={styles.featureLabel}>Position Details</Paragraph>
                              <View style={styles.featureContent}>
                                <Paragraph style={styles.featureValue}>Aspect Ratio: {aspectRatio}:1</Paragraph>
                                <Paragraph style={styles.featureValue}>Center: ({centerX}, {centerY})</Paragraph>
                              </View>
                            </View>
                          </View>

                          {idx < result.detections.length - 1 && <View style={styles.divider} />}
                        </View>
                      );
                    })}
                  </Card.Content>
                </Card>
              )}

              {/* Object Classification Summary */}
              {result.detections && result.detections.length > 0 && (
                <Card style={styles.classificationCard}>
                  <Card.Title title="Classification Breakdown" />
                  <Card.Content>
                    {(() => {
                      const classCount = {};
                      result.detections.forEach(det => {
                        classCount[det.class] = (classCount[det.class] || 0) + 1;
                      });

                      return Object.entries(classCount).map(([className, count], idx) => (
                        <View key={idx} style={styles.classRow}>
                          <View style={styles.classLabel}>
                            <View style={[
                              styles.classColorDot,
                              { backgroundColor: getSeverityColor(className) }
                            ]} />
                            <Paragraph style={styles.className}>{className}</Paragraph>
                          </View>
                          <Chip style={styles.countChip}>{count} found</Chip>
                        </View>
                      ));
                    })()}
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
    elevation: 3,
  },
  detailsContainer: {
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  detailsTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  detectionItem: {
    marginBottom: 12,
  },
  detectionNameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  detectionName: {
    fontSize: 13,
    fontWeight: '500',
    color: '#333',
    flex: 1,
  },
  confidenceText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#667eea',
  },
  confidenceBar: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
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
  resultCard: {
    marginHorizontal: 16,
    marginBottom: 12,
    elevation: 2,
  },
  analysisCard: {
    marginHorizontal: 16,
    marginBottom: 12,
    elevation: 2,
  },
  detailsCard: {
    marginHorizontal: 16,
    marginBottom: 12,
    elevation: 2,
  },
  classificationCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    elevation: 2,
  },
  summaryGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 8,
  },
  summaryItem: {
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  resultImage: {
    width: '100%',
    height: undefined,
    aspectRatio: 1,
    resizeMode: 'contain',
    marginVertical: 8,
  },
  detectionItemContainer: {
    paddingVertical: 12,
  },
  detectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  severityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  severityText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#fff',
  },
  detectionClassName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  confidenceSection: {
    marginBottom: 12,
  },
  confidenceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  confidenceLabel: {
    fontSize: 12,
    color: '#666',
  },
  confidencePercent: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  confidenceBarContainer: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  confidenceBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  bboxInfo: {
    backgroundColor: '#f0f0f5',
    padding: 8,
    borderRadius: 6,
    marginBottom: 8,
  },
  bboxText: {
    fontSize: 11,
    color: '#666',
    marginBottom: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 8,
  },
  classRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  classLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  classColorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  className: {
    fontSize: 13,
    fontWeight: '500',
    color: '#333',
  },
  countChip: {
    fontSize: 11,
  },
  detectionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  detectionClass: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  detectionConfidence: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#10b981',
  },
  resetButton: {
    marginHorizontal: 16,
    marginBottom: 20,
    borderColor: '#ef4444',
  },
  featureGrid: {
    gap: 10,
  },
  featureCard: {
    backgroundColor: '#f8f9fa',
    borderLeftWidth: 4,
    borderLeftColor: '#667eea',
    padding: 12,
    borderRadius: 6,
    marginBottom: 8,
  },
  featureLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#667eea',
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  featureContent: {
    gap: 4,
  },
  featureValue: {
    fontSize: 12,
    color: '#333',
    fontWeight: '500',
    lineHeight: 18,
  },
  classInfoColumn: {
    flex: 1,
  },
  classIdText: {
    fontSize: 11,
    color: '#666',
    marginTop: 2,
  },
});
