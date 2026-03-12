import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { uploadAndDetect } from '../services/api';

const CLASS_ICONS = {
  pothole: '🕳️',
  plastic: '♻️',
  'other litter': '🗑️',
};

const CLASS_COLORS = {
  pothole: '#FF6B6B',
  plastic: '#4ECDC4',
  'other litter': '#FFE66D',
};

export default function UploadScreen() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const pickImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert('Permission required', 'Camera roll permission is required');
        return;
      }

      let pickerResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!pickerResult.canceled) {
        const imageUri = pickerResult.assets[0].uri;
        setSelectedImage(imageUri);
        setResult(null);
        setError(null);
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to pick image: ' + err.message);
    }
  };

  const takePhoto = async () => {
    try {
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert('Permission required', 'Camera permission is required');
        return;
      }

      let pickerResult = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!pickerResult.canceled) {
        const imageUri = pickerResult.assets[0].uri;
        setSelectedImage(imageUri);
        setResult(null);
        setError(null);
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to take photo: ' + err.message);
    }
  };

  const handleDetect = async () => {
    if (!selectedImage) {
      Alert.alert('Error', 'Please select an image first');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const detectionResult = await uploadAndDetect(selectedImage);
      setResult(detectionResult);
    } catch (err) {
      console.error('Detection error:', err);
      setError(err.message || 'Detection failed');
      Alert.alert('Detection Error', err.message || 'Failed to detect objects');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedImage(null);
    setResult(null);
    setError(null);
  };

  const renderDetectionResults = () => {
    if (!result) return null;

    const detections = result.detections || [];
    const classCount = {};

    detections.forEach((detection) => {
      const className = detection.class?.toLowerCase() || 'unknown';
      classCount[className] = (classCount[className] || 0) + 1;
    });

    return (
      <View style={styles.resultsContainer}>
        <Text style={styles.resultsTitle}>✓ Detection Complete</Text>
        <Text style={styles.totalDetections}>
          Total Objects: {detections.length}
        </Text>

        {/* Detection Summary */}
        <View style={styles.summarySection}>
          <Text style={styles.sectionTitle}>Summary</Text>
          {Object.entries(classCount).map(([className, count]) => (
            <View key={className} style={styles.classItem}>
              <View
                style={[
                  styles.classBadge,
                  { backgroundColor: CLASS_COLORS[className] },
                ]}
              >
                <Text style={styles.classIcon}>
                  {CLASS_ICONS[className] || '📍'}
                </Text>
              </View>
              <View style={styles.classInfo}>
                <Text style={styles.className}>
                  {className.charAt(0).toUpperCase() + className.slice(1)}
                </Text>
                <Text style={styles.classCount}>{count} detected</Text>
              </View>
            </View>
          ))}
        </View>



        {result.message && (
          <View style={styles.messageBox}>
            <Text style={styles.message}>{result.message}</Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🛣️ Road Detection</Text>
        <Text style={styles.headerSubtitle}>Detect Potholes & Litter</Text>
      </View>

      <View style={styles.content}>
        {/* Image Preview or Upload Prompt */}
        <View style={styles.imageSection}>
          {selectedImage ? (
            <Image
              source={{ uri: selectedImage }}
              style={styles.selectedImage}
            />
          ) : (
            <View style={styles.uploadPrompt}>
              <Text style={styles.uploadIcon}>📁</Text>
              <Text style={styles.uploadText}>Select an image to analyze</Text>
            </View>
          )}
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            onPress={takePhoto}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>📷 Take Photo</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            onPress={pickImage}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>🖼️ Choose Image</Text>
          </TouchableOpacity>
        </View>

        {/* Detect Button */}
        {selectedImage && !isLoading && (
          <TouchableOpacity
            style={[styles.button, styles.detectButton]}
            onPress={handleDetect}
          >
            <Text style={styles.buttonText}>🔍 Detect Objects</Text>
          </TouchableOpacity>
        )}

        {/* Reset Button */}
        {result && !isLoading && (
          <TouchableOpacity
            style={[styles.button, styles.resetButton]}
            onPress={handleReset}
          >
            <Text style={styles.buttonText}>↻ Reset</Text>
          </TouchableOpacity>
        )}

        {/* Loading Indicator */}
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#667eea" />
            <Text style={styles.loadingText}>Analyzing image...</Text>
          </View>
        )}

        {/* Detection Results */}
        {renderDetectionResults()}

        {/* Supported Classes Info */}
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>📋 Supported Classes:</Text>
          <Text style={styles.infoText}>🕳️ Pothole - Road damage</Text>
          <Text style={styles.infoText}>♻️ Plastic - Plastic waste</Text>
          <Text style={styles.infoText}>🗑️ Other Litter - Garbage & debris</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#667eea',
    paddingTop: 40,
    paddingBottom: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  content: {
    padding: 20,
  },
  imageSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  uploadPrompt: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadIcon: {
    fontSize: 40,
    marginBottom: 10,
  },
  uploadText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 15,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButton: {
    flex: 1,
    backgroundColor: '#667eea',
  },
  detectButton: {
    width: '100%',
    backgroundColor: '#28a745',
    marginBottom: 15,
  },
  resetButton: {
    width: '100%',
    backgroundColor: '#e9ecef',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  loadingContainer: {
    paddingVertical: 40,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  loadingText: {
    marginTop: 15,
    fontSize: 14,
    color: '#667eea',
    fontWeight: '600',
  },
  resultsContainer: {
    backgroundColor: '#f0f9ff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#667eea',
  },
  resultsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#667eea',
    marginBottom: 8,
  },
  totalDetections: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    fontWeight: '500',
  },
  summarySection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#667eea',
  },
  classItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#667eea',
  },
  classBadge: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  classIcon: {
    fontSize: 20,
  },
  classInfo: {
    flex: 1,
  },
  className: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  classCount: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  detailsSection: {
    marginTop: 16,
  },
  detectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  detectionIndex: {
    fontSize: 12,
    fontWeight: '600',
    color: '#667eea',
    width: 30,
  },
  detectionInfo: {
    flex: 1,
  },
  detectionClass: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
  },
  detectionConfidence: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  messageBox: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#667eea',
  },
  message: {
    fontSize: 13,
    color: '#666',
  },
  infoBox: {
    backgroundColor: '#f8f9fa',
    borderLeftWidth: 3,
    borderLeftColor: '#667eea',
    padding: 16,
    borderRadius: 8,
    marginBottom: 30,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 13,
    color: '#666',
    marginBottom: 8,
    lineHeight: 18,
  },
});
