import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Image, Alert, Dimensions } from 'react-native';
import { Button, Card, Title, Paragraph, ActivityIndicator, Chip } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import * as ImagePicker from 'expo-image-picker';
import { API_BASE_URL } from '../services/api';
import { getCurrentLocation } from '../services/locationService';
import { lightTheme, spacing, typography, borderRadius } from '../config/theme';

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
      Alert.alert('No Image Selected', 'Please capture or upload a photo first', [{ text: 'OK' }]);
      return;
    }

    setIsLoading(true);
    const timeoutId = setTimeout(() => {
      setIsLoading(false);
      Alert.alert('Detection Timeout', `The backend server is taking too long to respond.\n\nBackend: ${API_BASE_URL}\n\nMake sure:\n• Backend server is running\n• Device has internet connection\n• API URL is correct`, [{ text: 'OK' }]);
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
      Alert.alert('Detection Failed', err.message || 'Unknown error occurred. Try again.', [{ text: 'OK' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedImage(null);
    setResult(null);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Hero Header */}
      <View style={styles.heroHeader}>
        <View style={styles.heroContent}>
          <MaterialCommunityIcons name="image-search" size={48} color={lightTheme.primary} />
          <Title style={styles.heroTitle}>Image Detection</Title>
          <Paragraph style={styles.heroSubtitle}>
            Capture or upload photos to detect road damage
          </Paragraph>
        </View>
      </View>

      {/* Image Preview Section */}
      <View style={styles.previewSection}>
        <View style={styles.previewHeader}>
          <Paragraph style={styles.previewLabel}>Image Preview</Paragraph>
          {selectedImage && (
            <Button 
              mode="text" 
              compact 
              onPress={handleReset}
              labelStyle={{ color: lightTheme.danger }}
            >
              Clear
            </Button>
          )}
        </View>
        
        <Card style={styles.imageCard}>
          {selectedImage ? (
            <Image source={{ uri: selectedImage }} style={styles.image} />
          ) : (
            <View style={styles.placeholder}>
              <Title style={styles.placeholderTitle}>Ready to Detect</Title>
              <Paragraph style={styles.placeholderText}>
                Select an image from your camera or gallery to analyze for road damage
              </Paragraph>
              <View style={styles.placeholderDots}>
                <View style={styles.dot} />
                <View style={styles.dot} />
                <View style={styles.dot} />
              </View>
            </View>
          )}
        </Card>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionSection}>
        <Button
          mode="contained"
          onPress={takePhoto}
          icon="camera"
          style={styles.actionButton}
          buttonColor={lightTheme.primary}
          labelStyle={styles.buttonLabel}
        >
          Capture Photo
        </Button>
        <Button
          mode="outlined"
          onPress={pickImage}
          icon="image-multiple"
          style={styles.actionButton}
          labelStyle={{ color: lightTheme.primary, fontSize: typography.body.fontSize, fontWeight: '600' }}
        >
          Gallery
        </Button>
      </View>

      {/* Detect Button */}
      {selectedImage && !isLoading && (
        <View style={styles.detectButtonSection}>
          <Button
            mode="contained"
            onPress={handleDetect}
            icon="play-circle"
            style={styles.detectButton}
            buttonColor={lightTheme.success}
            labelStyle={styles.detectButtonLabel}
          >
            Analyze Image
          </Button>
          <Paragraph style={styles.analyzeHint}>AI will detect road damage in seconds</Paragraph>
        </View>
      )}

      {/* Loading State */}
      {isLoading && (
        <Card style={styles.loadingCard}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator animating={true} size="large" color={lightTheme.primary} />
            <Title style={styles.loadingTitle}>Analyzing Image</Title>
            <Paragraph style={styles.loadingText}>Processing your image with AI...</Paragraph>
          </View>
        </Card>
      )}

      {/* Results Section */}
      {result && !isLoading && (
        <View style={styles.resultsSection}>
          {/* Results Header */}
          <View style={styles.resultsHeader}>
            <View style={styles.resultsHeaderContent}>
              <MaterialCommunityIcons name="check-circle" size={32} color={lightTheme.success} />
              <View style={styles.resultsHeaderText}>
                <Title style={styles.resultsTitle}>Detection Complete</Title>
                <Paragraph style={styles.resultsSubtitle}>
                  Found {result.count || 0} object(s) detected
                </Paragraph>
              </View>
            </View>
          </View>

          {result.image && (
            <>
              {/* Detected Image */}
              <Card style={styles.resultCard}>
                <Card.Title title="Detection Result" />
                <Card.Content>
                  <Image 
                    source={{ uri: `data:image/jpeg;base64,${result.image}` }} 
                    style={styles.resultImage}
                  />
                </Card.Content>
              </Card>

              {/* Analysis Summary */}
              <Card style={styles.summaryCard}>
                <Card.Title title="Analysis Summary" />
                <Card.Content>
                  <View style={styles.summaryGrid}>
                    <View style={styles.summaryItem}>
                      <View style={styles.summaryIconContainer}>
                        <MaterialCommunityIcons name="cube-outline" size={24} color={lightTheme.primary} />
                      </View>
                      <Paragraph style={styles.summaryLabel}>Objects</Paragraph>
                      <Title style={styles.summaryValue}>{result.count || 0}</Title>
                    </View>
                    <View style={styles.summaryItem}>
                      <View style={styles.summaryIconContainer}>
                        <MaterialCommunityIcons name="image-size-select-actual" size={24} color={lightTheme.info} />
                      </View>
                      <Paragraph style={styles.summaryLabel}>Resolution</Paragraph>
                      <Title style={styles.summaryValue}>
                        {result.width && result.height ? `${result.width}x${result.height}` : 'N/A'}
                      </Title>
                    </View>
                    <View style={styles.summaryItem}>
                      <View style={styles.summaryIconContainer}>
                        <MaterialCommunityIcons name="clock-fast" size={24} color={lightTheme.warning} />
                      </View>
                      <Paragraph style={styles.summaryLabel}>Time</Paragraph>
                      <Title style={styles.summaryValue}>
                        {result.processing_time_seconds ? `${result.processing_time_seconds}s` : 'Complete'}
                      </Title>
                    </View>
                  </View>
                </Card.Content>
              </Card>

              {/* Detection Details */}
              {result.detections && result.detections.length > 0 && (
                <Card style={styles.detailsCard}>
                  <Card.Title 
                    title="Detected Objects" 
                    subtitle={`${result.detections.length} item(s) found`}
                  />
                  <Card.Content>
                    {result.detections.map((detection, idx) => {
                      const severity = getObjectSeverity(detection.confidence);
                      const confidencePercent = Math.round((detection.confidence || 0) * 100);
                      const boxWidth = detection.x2 - detection.x1;
                      const boxHeight = detection.y2 - detection.y1;
                      const area = Math.round(boxWidth * boxHeight);
                      const aspectRatio = (boxWidth / boxHeight).toFixed(2);
                      const centerX = Math.round((detection.x1 + detection.x2) / 2);
                      const centerY = Math.round((detection.y1 + detection.y2) / 2);
                      const boxSizePercent = ((area / (result.width * result.height)) * 100).toFixed(2);
                      
                      return (
                        <View key={idx} style={styles.detectionContainer}>
                          <View style={styles.detectionHeader}>
                            <View style={[styles.severityBadge, { backgroundColor: severity.color }]}>
                              <Paragraph style={styles.severityText}>{severity.severity}</Paragraph>
                            </View>
                            <View style={styles.detectionTitleSection}>
                              <Title style={styles.detectionTitle}>
                                {detection.class || `Object ${idx + 1}`}
                              </Title>
                              <Paragraph style={styles.detectionSubtitle}>ID: {detection.class_id || idx}</Paragraph>
                            </View>
                          </View>

                          <View style={styles.confidenceSection}>
                            <View style={styles.confidenceHeader}>
                              <Paragraph style={styles.confidenceLabel}>Confidence Score</Paragraph>
                              <Paragraph style={[styles.confidencePercent, { color: getConfidenceColor(detection.confidence) }]}>
                                {confidencePercent}%
                              </Paragraph>
                            </View>
                            <View style={styles.confidenceBar}>
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

                          <View style={styles.featureGrid}>
                            <View style={styles.featureCard}>
                              <Paragraph style={styles.featureLabel}>Bounding Box</Paragraph>
                              <Paragraph style={styles.featureValue}>({Math.round(detection.x1)}, {Math.round(detection.y1)}) to ({Math.round(detection.x2)}, {Math.round(detection.y2)})</Paragraph>
                            </View>
                            <View style={styles.featureCard}>
                              <Paragraph style={styles.featureLabel}>Size</Paragraph>
                              <Paragraph style={styles.featureValue}>{Math.round(boxWidth)}px × {Math.round(boxHeight)}px</Paragraph>
                            </View>
                            <View style={styles.featureCard}>
                              <Paragraph style={styles.featureLabel}>Coverage</Paragraph>
                              <Paragraph style={styles.featureValue}>{boxSizePercent}% of image</Paragraph>
                            </View>
                          </View>

                          {idx < result.detections.length - 1 && <View style={styles.divider} />}
                        </View>
                      );
                    })}
                  </Card.Content>
                </Card>
              )}

              {/* Classification Breakdown */}
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
                        <View key={idx} style={styles.classItemContainer}>
                          <View style={styles.classItemContent}>
                            <View style={[
                              styles.classColorDot,
                              { backgroundColor: getSeverityColor(className) }
                            ]} />
                            <Title style={styles.classItemName}>{className}</Title>
                          </View>
                          <Chip style={styles.classCountChip}>{count}</Chip>
                        </View>
                      ));
                    })()}
                  </Card.Content>
                </Card>
              )}

              {/* Action Buttons */}
              <View style={styles.actionButtonsContainer}>
                <Button
                  mode="contained"
                  onPress={handleReset}
                  icon="refresh"
                  style={styles.flexButton}
                  buttonColor={lightTheme.primary}
                  labelStyle={styles.buttonLabel}
                >
                  New Detection
                </Button>
                <Button
                  mode="outlined"
                  icon="share-variant"
                  style={styles.flexButton}
                  labelStyle={{ color: lightTheme.primary }}
                  onPress={() => Alert.alert('Share', 'Share functionality coming soon')}
                >
                  Share
                </Button>
              </View>
            </>
          )}
        </View>
      )}
    </ScrollView>
  );
}

const screenHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: lightTheme.background,
  },

  // Hero Header
  heroHeader: {
    backgroundColor: lightTheme.surface,
    paddingVertical: spacing.xxxl,
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: lightTheme.border,
  },
  heroContent: {
    alignItems: 'center',
    gap: spacing.md,
  },
  heroTitle: {
    fontSize: typography.h2.fontSize,
    fontWeight: typography.h2.fontWeight,
    color: lightTheme.text.primary,
  },
  heroSubtitle: {
    fontSize: typography.body.fontSize,
    color: lightTheme.text.secondary,
    textAlign: 'center',
  },

  // Preview Section
  previewSection: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  previewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  previewLabel: {
    fontSize: typography.h6.fontSize,
    fontWeight: typography.h6.fontWeight,
    color: lightTheme.text.primary,
  },
  imageCard: {
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    elevation: 2,
  },
  image: {
    width: '100%',
    height: 300,
    resizeMode: 'contain',
  },
  placeholder: {
    width: '100%',
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: `${lightTheme.primary}08`,
    gap: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  placeholderTitle: {
    fontSize: typography.h4.fontSize,
    fontWeight: 'bold',
    color: lightTheme.text.primary,
    textAlign: 'center',
  },
  placeholderText: {
    fontSize: typography.body.fontSize,
    color: lightTheme.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  placeholderSubText: {
    fontSize: typography.small.fontSize,
    color: lightTheme.text.secondary,
  },
  placeholderDots: {
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'center',
    marginTop: spacing.md,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: lightTheme.primary,
  },

  // Action Buttons
  actionSection: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    gap: spacing.md,
  },
  actionButton: {
    paddingVertical: spacing.lg,
    borderRadius: borderRadius.md,
    borderWidth: 1.5,
  },
  buttonLabel: {
    fontSize: typography.body.fontSize,
    fontWeight: '600',
    letterSpacing: 0.3,
  },

  // Detect Button
  detectButtonSection: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  detectButton: {
    paddingVertical: spacing.lg,
    borderRadius: borderRadius.md,
  },
  detectButtonLabel: {
    fontSize: typography.h6.fontSize,
    fontWeight: 'bold',
    letterSpacing: 0.3,
  },
  analyzeHint: {
    fontSize: typography.small.fontSize,
    color: lightTheme.text.secondary,
    textAlign: 'center',
    marginTop: spacing.sm,
  },

  // Loading
  loadingCard: {
    marginHorizontal: spacing.lg,
    marginVertical: spacing.lg,
    borderRadius: borderRadius.lg,
  },
  loadingContainer: {
    paddingVertical: spacing.xxxl,
    alignItems: 'center',
    gap: spacing.md,
  },
  loadingTitle: {
    fontSize: typography.h5.fontSize,
    fontWeight: '600',
    color: lightTheme.text.primary,
  },
  loadingText: {
    fontSize: typography.body.fontSize,
    color: lightTheme.text.secondary,
  },

  // Results Section
  resultsSection: {
    flex: 1,
  },
  resultsHeader: {
    backgroundColor: `${lightTheme.success}12`,
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderLeftWidth: 5,
    borderLeftColor: lightTheme.success,
    flexDirection: 'row',
    gap: spacing.md,
  },
  resultsHeaderContent: {
    flexDirection: 'row',
    gap: spacing.md,
    alignItems: 'flex-start',
    flex: 1,
  },
  resultsHeaderText: {
    flex: 1,
    gap: spacing.xs,
  },
  resultsTitle: {
    fontSize: typography.h5.fontSize,
    fontWeight: '700',
    color: lightTheme.text.primary,
  },
  resultsSubtitle: {
    fontSize: typography.small.fontSize,
    color: lightTheme.text.secondary,
  },

  // Result Card
  resultCard: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
    borderRadius: borderRadius.lg,
    elevation: 3,
    backgroundColor: lightTheme.surface,
  },
  resultImage: {
    width: '100%',
    height: 300,
    resizeMode: 'contain',
  },

  // Summary Card
  summaryCard: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
    borderRadius: borderRadius.lg,
    elevation: 3,
    backgroundColor: lightTheme.surface,
  },
  summaryGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: spacing.lg,
  },
  summaryItem: {
    alignItems: 'center',
    flex: 1,
    gap: spacing.sm,
  },
  summaryIconContainer: {
    width: 52,
    height: 52,
    borderRadius: borderRadius.md,
    backgroundColor: `${lightTheme.primary}12`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: typography.caption.fontSize,
    color: lightTheme.text.secondary,
    fontWeight: '500',
  },
  summaryValue: {
    fontSize: typography.h5.fontSize,
    fontWeight: '700',
    color: lightTheme.text.primary,
  },

  // Details Card
  detailsCard: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
    borderRadius: borderRadius.lg,
    elevation: 3,
    backgroundColor: lightTheme.surface,
  },
  detectionContainer: {
    paddingVertical: spacing.lg,
  },
  detectionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  severityBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.sm,
  },
  severityText: {
    fontSize: typography.caption.fontSize,
    fontWeight: 'bold',
    color: '#fff',
  },
  detectionTitleSection: {
    flex: 1,
    gap: spacing.xs,
  },
  detectionTitle: {
    fontSize: typography.h6.fontSize,
    fontWeight: '700',
    color: lightTheme.text.primary,
  },
  detectionSubtitle: {
    fontSize: typography.small.fontSize,
    color: lightTheme.text.secondary,
  },
  confidenceSection: {
    marginBottom: spacing.lg,
  },
  confidenceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
    alignItems: 'center',
  },
  confidenceLabel: {
    fontSize: typography.small.fontSize,
    color: lightTheme.text.secondary,
    fontWeight: '500',
  },
  confidencePercent: {
    fontSize: typography.h6.fontSize,
    fontWeight: 'bold',
  },
  confidenceBar: {
    height: 10,
    backgroundColor: `${lightTheme.border}40`,
    borderRadius: borderRadius.sm,
    overflow: 'hidden',
  },
  confidenceBarFill: {
    height: '100%',
    borderRadius: borderRadius.sm,
  },
  featureGrid: {
    gap: spacing.lg,
  },
  featureCard: {
    backgroundColor: `${lightTheme.primary}08`,
    borderLeftWidth: 4,
    borderLeftColor: lightTheme.primary,
    padding: spacing.md,
    borderRadius: borderRadius.sm,
    paddingVertical: spacing.md,
  },
  featureLabel: {
    fontSize: typography.caption.fontSize,
    fontWeight: '700',
    color: lightTheme.primary,
    textTransform: 'uppercase',
    marginBottom: spacing.sm,
    letterSpacing: 0.5,
  },
  featureValue: {
    fontSize: typography.body.fontSize,
    color: lightTheme.text.primary,
    fontWeight: '600',
    lineHeight: 20,
  },
  divider: {
    height: 1,
    backgroundColor: lightTheme.border,
    marginVertical: spacing.lg,
  },

  // Classification Card
  classificationCard: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
    borderRadius: borderRadius.lg,
    elevation: 2,
  },
  classItemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: lightTheme.border,
  },
  classItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  classColorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  classItemName: {
    fontSize: typography.body.fontSize,
    fontWeight: '500',
    color: lightTheme.text.primary,
  },
  classCountChip: {
    fontSize: typography.caption.fontSize,
  },

  // Action Buttons Container
  actionButtonsContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxl,
    gap: spacing.md,
  },
  flexButton: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
  },
});
