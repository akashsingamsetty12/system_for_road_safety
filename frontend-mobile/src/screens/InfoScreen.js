import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';

export default function HistoryScreen() {
  const handleOpenBackend = async () => {
    const url = 'http://192.168.1.100:8080';
    try {
      await Linking.openURL(url);
    } catch (err) {
      Alert.alert('Error', 'Could not open backend API');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>📊 Information</Text>
      </View>

      <View style={styles.content}>
        {/* API Configuration */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔌 API Configuration</Text>
          <View style={styles.infoCard}>
            <Text style={styles.label}>Backend API:</Text>
            <Text style={styles.value}>http://192.168.1.100:8080</Text>
            <Text style={styles.note}>Make sure to replace with your backend IP</Text>
          </View>
        </View>

        {/* Detection Classes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Detection Classes</Text>

          <View style={styles.classCard}>
            <View style={styles.classIconContainer}>
              <Text style={[styles.classIcon, { color: '#ef4444' }]}>!</Text>
            </View>
            <View style={styles.classDetails}>
              <Text style={styles.className}>Pothole</Text>
              <Text style={styles.classDesc}>Damaged road surface with holes or cracks</Text>
            </View>
          </View>

          <View style={styles.classCard}>
            <View style={styles.classIconContainer}>
              <Text style={[styles.classIcon, { color: '#f59e0b' }]}>~</Text>
            </View>
            <View style={styles.classDetails}>
              <Text style={styles.className}>Plastic</Text>
              <Text style={styles.classDesc}>Plastic waste and bottles on road</Text>
            </View>
          </View>

          <View style={styles.classCard}>
            <View style={styles.classIconContainer}>
              <Text style={[styles.classIcon, { color: '#eab308' }]}>*</Text>
            </View>
            <View style={styles.classDetails}>
              <Text style={styles.className}>Other Litter</Text>
              <Text style={styles.classDesc}>General garbage, debris, and waste</Text>
            </View>
          </View>
        </View>

        {/* Features */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Features</Text>
          <View style={styles.featureItem}>
            <View style={styles.featureBulletContainer}>
              <Text style={styles.featureBullet}>📷</Text>
            </View>
            <Text style={styles.featureText}>Take photos directly from camera</Text>
          </View>
          <View style={styles.featureItem}>
            <View style={styles.featureBulletContainer}>
              <Text style={styles.featureBullet}>🖼️</Text>
            </View>
            <Text style={styles.featureText}>Upload images from gallery</Text>
          </View>
          <View style={styles.featureItem}>
            <View style={styles.featureBulletContainer}>
              <Text style={styles.featureBullet}>🔍</Text>
            </View>
            <Text style={styles.featureText}>Real-time object detection</Text>
          </View>
          <View style={styles.featureItem}>
            <View style={styles.featureBulletContainer}>
              <Text style={styles.featureBullet}>📊</Text>
            </View>
            <Text style={styles.featureText}>Detailed detection statistics</Text>
          </View>
          <View style={styles.featureItem}>
            <View style={styles.featureBulletContainer}>
              <Text style={styles.featureBullet}>⚡</Text>
            </View>
            <Text style={styles.featureText}>Confidence scores for each detection</Text>
          </View>
        </View>

        {/* How to Use */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How to Use</Text>
          <View style={styles.stepCard}>
            <View style={styles.stepNumberContainer}>
              <Text style={styles.stepNumber}>1</Text>
            </View>
            <Text style={styles.stepText}>Take a photo or select from gallery</Text>
          </View>
          <View style={styles.stepCard}>
            <Text style={styles.stepNumber}>2</Text>
            <Text style={styles.stepText}>Tap "Detect Objects" button</Text>
          </View>
          <View style={styles.stepCard}>
            <Text style={styles.stepNumber}>3</Text>
            <Text style={styles.stepText}>View detection results and statistics</Text>
          </View>
          <View style={styles.stepCard}>
            <Text style={styles.stepNumber}>4</Text>
            <Text style={styles.stepText}>Tap "Reset" to analyze another image</Text>
          </View>
        </View>

        {/* System Setup */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⚙️ Required Setup</Text>
          <View style={styles.setupItem}>
            <Text style={styles.setupLabel}>Backend Server:</Text>
            <Text style={styles.setupValue}>Spring Boot on Port 8080</Text>
          </View>
          <View style={styles.setupItem}>
            <Text style={styles.setupLabel}>YOLO API:</Text>
            <Text style={styles.setupValue}>Python Flask on Port 5000</Text>
          </View>
          <View style={styles.setupItem}>
            <Text style={styles.setupLabel}>Database:</Text>
            <Text style={styles.setupValue}>MongoDB Cloud or Local</Text>
          </View>
          <View style={styles.setupItem}>
            <Text style={styles.setupLabel}>Network:</Text>
            <Text style={styles.setupValue}>Same WiFi as your device</Text>
          </View>
        </View>

        {/* API Configuration Guide */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔧 Configuring API URL</Text>
          <View style={styles.configBox}>
            <Text style={styles.configTitle}>Step 1: Find Your Computer IP</Text>
            <Text style={styles.configCode}>Windows: ipconfig (look for IPv4 Address)</Text>
            <Text style={styles.configCode}>Mac/Linux: ifconfig | grep inet</Text>
          </View>
          <View style={styles.configBox}>
            <Text style={styles.configTitle}>Step 2: Edit API File</Text>
            <Text style={styles.configText}>
              Update the API URL in src/services/api.js with your IP address:
            </Text>
            <Text style={styles.configCode}>http://YOUR_IP:8080/api</Text>
          </View>
          <View style={styles.configBox}>
            <Text style={styles.configTitle}>Step 3: Restart Expo App</Text>
            <Text style={styles.configText}>
              Press "r" in terminal to reload the app
            </Text>
          </View>
        </View>

        {/* Troubleshooting */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🐛 Troubleshooting</Text>
          <View style={styles.troubleItem}>
            <Text style={styles.troubleTitle}>API Connection Failed</Text>
            <Text style={styles.troubleText}>
              • Check backend is running on :8080{'\n'}
              • Use computer IP instead of localhost{'\n'}
              • Ensure device is on same WiFi
            </Text>
          </View>
          <View style={styles.troubleItem}>
            <Text style={styles.troubleTitle}>Camera Permission Denied</Text>
            <Text style={styles.troubleText}>
              • Go to Settings → Expo Go → Permissions{'\n'}
              • Enable Camera and Photo Library access
            </Text>
          </View>
          <View style={styles.troubleItem}>
            <Text style={styles.troubleTitle}>Detection Timeout</Text>
            <Text style={styles.troubleText}>
              • Ensure YOLO API is running on port 5000{'\n'}
              • Check network connectivity{'\n'}
              • Reduce image quality/size
            </Text>
          </View>
        </View>

        {/* About */}
        <View style={styles.footer}>
          <Text style={styles.versionText}>Road Detection System v1.0.0</Text>
          <Text style={styles.copyrightText}>© 2026 - All Rights Reserved</Text>
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
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 2,
    borderBottomColor: '#667eea',
  },
  infoCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#667eea',
  },
  label: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  value: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  note: {
    fontSize: 12,
    color: '#f1b44e',
    fontStyle: 'italic',
  },
  classCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  classIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: '#f0f0f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  classIcon: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  classDetails: {
    flex: 1,
  },
  className: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  classDesc: {
    fontSize: 12,
    color: '#999',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  featureBulletContainer: {
    width: 32,
    height: 32,
    borderRadius: 6,
    backgroundColor: '#f0f0f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  featureBullet: {
    fontSize: 16,
  },
  featureText: {
    fontSize: 13,
    color: '#666',
    flex: 1,
  },
  stepCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f9ff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#667eea',
  },
  stepNumberContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#667eea',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  stepNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  stepText: {
    fontSize: 13,
    color: '#333',
    flex: 1,
  },
  setupItem: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  setupLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  setupValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
  },
  configBox: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#667eea',
  },
  configTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  configText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
    lineHeight: 18,
  },
  configCode: {
    fontSize: 11,
    fontFamily: 'Menlo',
    backgroundColor: '#e8e8e8',
    color: '#333',
    padding: 8,
    borderRadius: 4,
    marginBottom: 4,
  },
  troubleItem: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#ff6b6b',
  },
  troubleTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#ff6b6b',
    marginBottom: 6,
  },
  troubleText: {
    fontSize: 12,
    color: '#666',
    lineHeight: 18,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    marginTop: 20,
  },
  versionText: {
    fontSize: 12,
    color: '#999',
  },
  copyrightText: {
    fontSize: 11,
    color: '#bbb',
    marginTop: 4,
  },
});
