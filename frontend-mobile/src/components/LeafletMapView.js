import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Text, Button } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import * as WebBrowser from 'expo-web-browser';
import { MAP_URL, DASHBOARD_URL } from '../config/serverConfig';

/**
 * LeafletMapView Component
 * Opens the Leaflet-based map in the device's native browser
 * No native modules needed - uses Expo's WebBrowser
 */
export default function LeafletMapView({ locations }) {
  const handleOpenMap = async () => {
    try {
      console.log(`🗺️ Opening map: ${MAP_URL}`);
      await WebBrowser.openBrowserAsync(MAP_URL);
    } catch (error) {
      console.error('❌ Error opening map:', error);
    }
  };

  const handleOpenDashboard = async () => {
    try {
      console.log('🌐 Opening admin dashboard');
      await WebBrowser.openBrowserAsync(DASHBOARD_URL);
    } catch (error) {
      console.error('❌ Error opening dashboard:', error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Map Preview Card */}
      <View style={styles.mapPreview}>
        <MaterialCommunityIcons 
          name="map" 
          size={80} 
          color="#667eea" 
          style={styles.mapIcon}
        />
        <Text style={styles.previewText}>
          Interactive Leaflet Map
        </Text>
        <Text style={styles.previewSubtext}>
          OpenStreetMap with 100+ pothole markers
        </Text>
      </View>

      {/* Map URL Display */}
      <View style={styles.urlCard}>
        <MaterialCommunityIcons name="web" size={18} color="#667eea" />
        <Text style={styles.urlText}>{MAP_URL}</Text>
      </View>

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <Pressable 
          style={[styles.button, styles.buttonPrimary]}
          onPress={handleOpenMap}
        >
          <MaterialCommunityIcons name="map-marker-multiple" size={20} color="#fff" />
          <Text style={styles.buttonText}>Open Full Map</Text>
        </Pressable>

        <Pressable 
          style={[styles.button, styles.buttonSecondary]}
          onPress={handleOpenDashboard}
        >
          <MaterialCommunityIcons name="view-dashboard" size={20} color="#667eea" />
          <Text style={styles.buttonTextSecondary}>Open Dashboard</Text>
        </Pressable>
      </View>

      {/* Info Box */}
      <View style={styles.infoBox}>
        <MaterialCommunityIcons name="information-outline" size={20} color="#f59e0b" />
        <Text style={styles.infoText}>
          Make sure admin-web is running on port 3000
        </Text>
      </View>

      {/* Instructions */}
      <View style={styles.instructionsBox}>
        <Text style={styles.instructionTitle}>How to use:</Text>
        <Text style={styles.instructionText}>
          1. Start terminal: {'\n'}
          <Text style={styles.code}>cd admin-web && npm start{'\n'}</Text>
          2. Click "Open Full Map"{'\n'}
          3. See all 100+ potholes on map{'\n'}
          4. Click markers for details
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    padding: 12,
  },
  mapPreview: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginBottom: 12,
    elevation: 2,
  },
  mapIcon: {
    marginBottom: 12,
    color: '#667eea',
  },
  previewText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 4,
  },
  previewSubtext: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
  urlCard: {
    backgroundColor: '#eff6ff',
    borderRadius: 8,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#667eea',
  },
  urlText: {
    fontSize: 12,
    color: '#1f2937',
    fontFamily: 'monospace',
    flex: 1,
  },
  buttonContainer: {
    gap: 10,
    marginBottom: 12,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 8,
    elevation: 2,
  },
  buttonPrimary: {
    backgroundColor: '#667eea',
  },
  buttonSecondary: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#667eea',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
  },
  buttonTextSecondary: {
    fontSize: 14,
    fontWeight: '700',
    color: '#667eea',
  },
  infoBox: {
    backgroundColor: '#fef3c7',
    borderRadius: 8,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#f59e0b',
  },
  infoText: {
    fontSize: 12,
    color: '#92400e',
    fontWeight: '600',
    flex: 1,
    paddingTop: 2,
  },
  instructionsBox: {
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  instructionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 8,
  },
  instructionText: {
    fontSize: 11,
    color: '#6b7280',
    lineHeight: 18,
  },
  code: {
    fontFamily: 'monospace',
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 3,
    color: '#667eea',
    fontWeight: '600',
  },
});
