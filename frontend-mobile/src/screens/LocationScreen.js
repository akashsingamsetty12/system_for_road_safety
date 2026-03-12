import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Alert, Dimensions } from 'react-native';
import { Button, Card, Title, Paragraph, ActivityIndicator } from 'react-native-paper';

export default function LocationScreen() {
  const [location, setLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [detections, setDetections] = useState([]);

  const getCurrentLocation = async () => {
    // Simulated location data
    const mockLocation = {
      coords: {
        latitude: 17.385044,
        longitude: 78.486671,
        accuracy: 10
      }
    };
    setLocation(mockLocation);
    simulateNearbyDetections(mockLocation.coords);
  };

  const simulateNearbyDetections = (coords) => {
    const mockDetections = [
      {
        id: 1,
        type: 'Pothole',
        distance: 0.3,
        severity: 'High',
        latitude: coords.latitude + 0.001,
        longitude: coords.longitude + 0.001,
        reported: '2 hours ago',
      },
      {
        id: 2,
        type: 'Pothole',
        distance: 0.5,
        severity: 'Medium',
        latitude: coords.latitude - 0.001,
        longitude: coords.longitude + 0.002,
        reported: '5 hours ago',
      },
      {
        id: 3,
        type: 'Litter',
        distance: 0.8,
        severity: 'Low',
        latitude: coords.latitude + 0.002,
        longitude: coords.longitude - 0.001,
        reported: '1 day ago',
      },
      {
        id: 4,
        type: 'Pothole',
        distance: 1.2,
        severity: 'High',
        latitude: coords.latitude - 0.002,
        longitude: coords.longitude - 0.002,
        reported: '3 days ago',
      },
    ];
    setDetections(mockDetections);
  };

  const handleReportIssue = async () => {
    if (!location) {
      Alert.alert('Error', 'Please get your location first');
      return;
    }

    Alert.prompt(
      'Report Issue',
      'What did you find?',
      [
        { text: 'Cancel', onPress: () => {}, style: 'cancel' },
        {
          text: 'Submit',
          onPress: (value) => {
            Alert.alert('Success', `Issue reported at location\n${location.coords.latitude.toFixed(6)}, ${location.coords.longitude.toFixed(6)}`);
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Title style={styles.headerTitle}>📍 Location Tracking</Title>
        <Paragraph style={styles.headerDesc}>
          Find and report road damage near you
        </Paragraph>
      </View>

      {/* Current Location Card */}
      <Card style={styles.locationCard}>
        <Card.Content>
          {location ? (
            <>
              <Title>Your Location</Title>
              <Paragraph style={styles.coordText}>
                📌 {location.coords.latitude.toFixed(6)}, {location.coords.longitude.toFixed(6)}
              </Paragraph>
              <Paragraph style={styles.accuracyText}>
                Accuracy: ±{Math.round(location.coords.accuracy)}m
              </Paragraph>
            </>
          ) : (
            <Paragraph style={styles.noLocationText}>Location not set</Paragraph>
          )}
        </Card.Content>
      </Card>

      {/* Action Buttons */}
      <View style={styles.buttonGroup}>
        <Button
          mode="contained"
          onPress={getCurrentLocation}
          icon="map-marker"
          loading={isLoading}
          disabled={isLoading}
          style={styles.halfButton}
        >
          Get Location
        </Button>
        <Button
          mode="outlined"
          onPress={handleReportIssue}
          icon="plus-circle"
          style={styles.halfButton}
          disabled={!location}
        >
          Report
        </Button>
      </View>

      {/* Nearby Detections */}
      {detections.length > 0 && (
        <>
          <View style={styles.sectionHeader}>
            <Title style={styles.sectionTitle}>
              🗺️ Nearby Issues ({detections.length})
            </Title>
          </View>

          {detections.map((detection) => (
            <Card key={detection.id} style={styles.detectionCard}>
              <Card.Content>
                <View style={styles.detectionHeader}>
                  <View>
                    <Title style={styles.detectionType}>{detection.type}</Title>
                    <Paragraph style={styles.detectionDistance}>
                      📍 {detection.distance} km away
                    </Paragraph>
                  </View>
                  <View style={[styles.severityBadge, { backgroundColor: getSeverityColor(detection.severity) }]}>
                    <Paragraph style={styles.severityText}>{detection.severity}</Paragraph>
                  </View>
                </View>

                <View style={styles.coordsContainer}>
                  <Paragraph style={styles.coordText}>
                    {detection.latitude.toFixed(6)}, {detection.longitude.toFixed(6)}
                  </Paragraph>
                </View>

                <Paragraph style={styles.reportedTime}>
                  Reported: {detection.reported}
                </Paragraph>

                <Button
                  mode="text"
                  onPress={() => {
                    Alert.alert(
                      'Navigate',
                      `Open maps to navigate to this location?\n${detection.latitude.toFixed(6)}, ${detection.longitude.toFixed(6)}`
                    );
                  }}
                  icon="directions"
                  style={styles.navigateButton}
                >
                  Navigate
                </Button>
              </Card.Content>
            </Card>
          ))}
        </>
      )}

      {/* Info Card */}
      <Card style={styles.infoCard}>
        <Card.Title title="ℹ️ How to Use" />
        <Card.Content>
          <Paragraph style={styles.infoText}>
            1. Tap "Get Location" to enable location tracking{'\n'}
            2. View nearby reported road issues{'\n'}
            3. Use "Navigate" to check locations{'\n'}
            4. Help report new issues to improve the community
          </Paragraph>
        </Card.Content>
      </Card>

      {/* Stats */}
      <Card style={styles.statsCard}>
        <Card.Title title="📊 Community Stats" />
        <Card.Content>
          <View style={styles.statRow}>
            <Paragraph style={styles.statLabel}>Total Reports:</Paragraph>
            <Paragraph style={styles.statValue}>1,845</Paragraph>
          </View>
          <View style={styles.statRow}>
            <Paragraph style={styles.statLabel}>Coverage Area:</Paragraph>
            <Paragraph style={styles.statValue}>12.5 km²</Paragraph>
          </View>
          <View style={styles.statRow}>
            <Paragraph style={styles.statLabel}>Active Contributors:</Paragraph>
            <Paragraph style={styles.statValue}>342</Paragraph>
          </View>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

function getSeverityColor(severity) {
  switch (severity.toLowerCase()) {
    case 'high':
      return '#ef4444';
    case 'medium':
      return '#f59e0b';
    case 'low':
      return '#10b981';
    default:
      return '#999';
  }
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
  locationCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    elevation: 2,
    minHeight: 120,
    justifyContent: 'center',
  },
  coordText: {
    fontSize: 12,
    fontFamily: 'monospace',
    color: '#667eea',
    marginTop: 8,
    fontWeight: '600',
  },
  accuracyText: {
    fontSize: 11,
    color: '#999',
    marginTop: 6,
  },
  noLocationText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  buttonGroup: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 16,
  },
  halfButton: {
    flex: 1,
  },
  sectionHeader: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  detectionCard: {
    marginHorizontal: 16,
    marginBottom: 12,
    elevation: 2,
  },
  detectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  detectionType: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  detectionDistance: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  severityBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  severityText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
  },
  coordsContainer: {
    backgroundColor: '#f0f0f5',
    padding: 8,
    borderRadius: 6,
    marginBottom: 8,
  },
  reportedTime: {
    fontSize: 11,
    color: '#999',
    marginBottom: 12,
  },
  navigateButton: {
    marginHorizontal: -16,
  },
  infoCard: {
    marginHorizontal: 16,
    marginVertical: 12,
    elevation: 2,
  },
  infoText: {
    fontSize: 12,
    color: '#666',
    lineHeight: 20,
  },
  statsCard: {
    marginHorizontal: 16,
    marginBottom: 20,
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
});
