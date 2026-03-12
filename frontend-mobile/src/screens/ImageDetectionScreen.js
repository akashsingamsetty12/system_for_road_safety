import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Image, Alert } from 'react-native';
import { Button, Card, Title, Paragraph, ActivityIndicator, SegmentedButtons, Chip } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { API_BASE_URL } from '../services/api';

const getConfidenceColor = (confidence) => {
  if (!confidence) return '#ccc';
  if (confidence > 0.8) return '#10b981';
  if (confidence > 0.6) return '#f59e0b';
  return '#ef4444';
};

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

      console.log(`Uploading image to: ${API_BASE_URL}/potholes/detect`);
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
      Alert.alert('✅ Detection Complete', `Found ${data.count || 0} object(s)`, [{ text: 'OK' }], { cancelable: false });
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
            <Card style={styles.resultCard}>
              <Card.Title 
                title="✅ Detection Complete" 
                subtitle={`Found ${result.count || 0} object(s)`}
              />
              <Card.Content>
                <Image 
                  source={{ uri: `data:image/jpeg;base64,${result.image}` }} 
                  style={styles.resultImage}
                />
                
                {/* Detection Details */}
                {result.detections && result.detections.length > 0 && (
                  <View style={styles.detailsContainer}>
                    <Title style={styles.detailsTitle}>Detected Objects</Title>
                    {result.detections.map((detection, idx) => (
                      <View key={idx} style={styles.detectionItem}>
                        <View style={styles.detectionNameRow}>
                          <Paragraph style={styles.detectionName}>
                            {detection.class || `Object ${idx + 1}`}
                          </Paragraph>
                          <Paragraph style={styles.confidenceText}>
                            {detection.confidence ? `${Math.round(detection.confidence * 100)}%` : 'N/A'}
                          </Paragraph>
                        </View>
                        <View style={[styles.confidenceBar, { backgroundColor: getConfidenceColor(detection.confidence) }]} />
                      </View>
                    ))}
                  </View>
                )}
              </Card.Content>
            </Card>
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
  resultImage: {
    width: '100%',
    height: undefined,
    aspectRatio: 1,
    resizeMode: 'contain',
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
});
