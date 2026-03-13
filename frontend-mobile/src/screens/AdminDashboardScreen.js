import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, FlatList, Alert } from 'react-native';
import { Card, Title, Paragraph, Button, Chip, Menu } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { API_BASE_URL } from '../services/api';
import { lightTheme, spacing, typography, borderRadius } from '../config/theme';
import LeafletMapView from '../components/LeafletMapView';

// Helper component for empty states
function EmptyState({ icon, title, desc }) {
  return (
    <View style={styles.emptyContainer}>
      <MaterialCommunityIcons name={icon} size={60} color="#9ca3af" />
      <Title style={styles.emptyTitle}>{title}</Title>
      <Paragraph style={styles.emptyDesc}>{desc}</Paragraph>
    </View>
  );
}

// Enhanced Tab Button Component
function TabButton({ active, onPress, icon, label }) {
  return (
    <Button
      mode={active ? 'contained' : 'outlined'}
      onPress={onPress}
      icon={icon}
      style={[styles.tabButton, active && styles.tabButtonActive]}
      buttonColor={active ? lightTheme.primary : undefined}
      textColor={active ? '#fff' : lightTheme.primary}
      labelStyle={styles.tabButtonLabel}
    >
      {label}
    </Button>
  );
}

// Fetch locations from backend
async function fetchLocationsData() {
  try {
    console.log('📍 Fetching potholes from backend...');
    
    // Try to fetch from /locations endpoint first (hardcoded data)
    let response = await fetch(`${API_BASE_URL}/potholes/locations`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    });
    
    console.log('📍 Response status from /locations:', response.status);
    
    // Fallback to /potholes endpoint if /locations fails
    if (!response.ok) {
      console.warn(`⚠️ /locations endpoint failed (${response.status}), trying /potholes...`);
      response = await fetch(`${API_BASE_URL}/potholes`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        timeout: 10000,
      });
    }
    
    if (!response.ok) {
      console.warn(`HTTP ${response.status}, using mock data`);
      return generateMockLocations();
    }

    const data = await response.json();
    
    if (!Array.isArray(data)) {
      console.warn('Response is not an array, using mock data');
      return generateMockLocations();
    }
    
    console.log(`Successfully fetched ${data.length} potholes from backend`);
    
    // Transform potholes to location format for map
    const transformedLocations = data
      .map((pothole, index) => {
        try {
          // Safely extract latitude/longitude as numbers
          let lat = pothole.latitude;
          let lng = pothole.longitude;
          
          // Convert to number if string
          if (typeof lat === 'string') {
            lat = parseFloat(lat);
          }
          if (typeof lng === 'string') {
            lng = parseFloat(lng);
          }
          
          // Validate the values are proper numbers
          if (lat === null || lat === undefined || lng === null || lng === undefined) {
            console.warn(`⚠️ Missing coordinates for pothole ${pothole.id}:`, { lat, lng });
            return null;
          }
          
          if (isNaN(lat) || isNaN(lng) || !isFinite(lat) || !isFinite(lng)) {
            console.warn(`⚠️ Invalid coordinates for pothole ${pothole.id}:`, { lat, lng });
            return null;
          }
          
          return {
            id: pothole.id || `pothole_${index}`,
            latitude: lat,
            longitude: lng,
            severity: pothole.severity || 'Unknown',
            area: pothole.area || pothole.location || `Area ${index + 1}`,
            issues: pothole.issues || 0,
            location: pothole.location,
            timestamp: pothole.timestamp,
            _original: pothole,
          };
        } catch (error) {
          console.warn(`⚠️ Error transforming pothole ${index}:`, error);
          return null;
        }
      })
      .filter(item => item !== null);
    
    console.log(`Transformed ${transformedLocations.length} valid locations`);
    return transformedLocations;
    
  } catch (error) {
    console.warn('⚠️ Failed to fetch from backend:', error.message);
    console.log('📍 Using mock location data as fallback...');
    return generateMockLocations();
  }
}

// Generate mock locations for demo
function generateMockLocations() {
  const areaNames = [
    'Downtown District', 'Highway Zone', 'Suburbs', 'Market Street', 'Park Avenue',
    'Main Street', 'Broadway', 'Central Park', 'Fifth Avenue', 'Wall Street',
  ];

  const locations = [];
  const baseLat = 15.3173;
  const baseLng = 75.7139;

  for (let i = 0; i < 100; i++) {
    const latitude = (baseLat + (Math.random() - 0.5) * 5).toFixed(6);
    const longitude = (baseLng + (Math.random() - 0.5) * 5).toFixed(6);
    const issues = Math.floor(Math.random() * 100) + 1;

    const severity = issues > 60 ? 'Critical' : issues > 35 ? 'High' : issues > 15 ? 'Medium' : 'Low';

    locations.push({
      id: i + 1,
      area: areaNames[i % areaNames.length] + ' Zone ' + (i + 1),
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      issues: issues,
      severity: severity,
    });
  }

  return locations;
}



export default function AdminDashboardScreen({ navigation }) {
  const [menuVisible, setMenuVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('stats');
  const [locations, setLocations] = useState([]);
  const [stats, setStats] = useState({
    totalDetections: 1245,
    potholes: 854,
    litter: 289,
    otherDamage: 102,
    activeUsers: 342,
    reportsResolved: 928,
    averageLatency: 234,
  });

  useEffect(() => {
    console.log('📱 AdminDashboardScreen mounted - fetching locations...');
    fetchLocationsData().then(data => {
      console.log(`🗺️ Loaded ${data.length} locations into map`);
      setLocations(data);
    });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        totalDetections: prev.totalDetections + Math.floor(Math.random() * 5),
        activeUsers: Math.floor(Math.random() * 500) + 200,
      }));
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', onPress: () => setMenuVisible(false) },
        {
          text: 'Logout',
          onPress: () => {
            setMenuVisible(false);
            navigation.reset({
              index: 0,
              routes: [{ name: 'UserApp' }],
            });
          },
        },
      ]
    );
  };

  const images = [
    { id: 1, title: 'System Dashboard', detections: 0, timestamp: 'Current', status: 'Active' },
  ];

  const videos = [
    { id: 1, title: '5min Road Inspection', duration: '5:23', detections: 12, timestamp: '1 hour ago' },
    { id: 2, title: 'Highway Survey', duration: '8:45', detections: 18, timestamp: '3 hours ago' },
    { id: 3, title: 'Street Scan', duration: '3:12', detections: 5, timestamp: '5 hours ago' },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Modern Hero Header */}
      <View style={styles.heroHeader}>
        <View style={styles.heroContent}>
          <MaterialCommunityIcons name="chart-box-plus-outline" size={48} color={lightTheme.primary} />
          <Title style={styles.heroTitle}>Admin Dashboard</Title>
          <Paragraph style={styles.heroSubtitle}>System Analytics & Real-Time Monitoring</Paragraph>
        </View>
      </View>

      {/* Modern Tab Buttons */}
      <View style={styles.tabButtonsContainer}>
        <View style={styles.tabButtons}>
          <TabButton
            active={activeTab === 'stats'}
            onPress={() => setActiveTab('stats')}
            icon="chart-line"
            label=""
          />
          <TabButton
            active={activeTab === 'images'}
            onPress={() => setActiveTab('images')}
            icon="image-multiple"
            label=""
          />
          <TabButton
            active={activeTab === 'videos'}
            onPress={() => setActiveTab('videos')}
            icon="video"
            label=""
          />
          <TabButton
            active={activeTab === 'map'}
            onPress={() => setActiveTab('map')}
            icon="map"
            label=""
          />
        </View>
        <Button
          icon="logout"
          onPress={handleLogout}
          textColor={lightTheme.danger}
          style={styles.logoutButton}
        >
          Logout
        </Button>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {activeTab === 'stats' && <StatisticsContent stats={stats} />}
        {activeTab === 'images' && <ImagesContent images={images} />}
        {activeTab === 'videos' && <VideosContent videos={videos} />}
        {activeTab === 'map' && <MapContent locations={locations} />}
      </View>
    </ScrollView>
  );
}

function StatisticsContent({ stats }) {
  return (
    <View style={styles.contentSection}>
      {/* Key Metrics Grid */}
      <Title style={styles.sectionTitle}>Overview</Title>
      
      <View style={styles.statsGrid}>
        <StatCard
          title="Total"
          value={stats.totalDetections}
          icon="check-circle"
          color={lightTheme.success}
        />
        <StatCard
          title="Potholes"
          value={stats.potholes}
          icon="pot-mix"
          color={lightTheme.danger}
        />
        <StatCard
          title="Litter"
          value={stats.litter}
          icon="trash-can"
          color={lightTheme.warning}
        />
        <StatCard
          title="Other"
          value={stats.otherDamage}
          icon="alert-circle"
          color={lightTheme.primary}
        />
      </View>

      {/* Quick Stats Card */}
      <Card style={styles.metricsCard}>
        <Card.Content>
          <View style={styles.quickStatsGrid}>
            <View style={styles.quickStatItem}>
              <MaterialCommunityIcons name="account-multiple" size={20} color={lightTheme.primary} />
              <Paragraph style={styles.quickStatLabel}>Active Users</Paragraph>
              <Title style={styles.quickStatValue}>{stats.activeUsers}</Title>
            </View>
            <View style={styles.quickStatItem}>
              <MaterialCommunityIcons name="check-all" size={20} color={lightTheme.success} />
              <Paragraph style={styles.quickStatLabel}>Resolved</Paragraph>
              <Title style={styles.quickStatValue}>{stats.reportsResolved}</Title>
            </View>
            <View style={styles.quickStatItem}>
              <MaterialCommunityIcons name="clock-fast" size={20} color={lightTheme.warning} />
              <Paragraph style={styles.quickStatLabel}>Latency</Paragraph>
              <Title style={styles.quickStatValue}>{stats.averageLatency}ms</Title>
            </View>
            <View style={styles.quickStatItem}>
              <MaterialCommunityIcons name="server-network" size={20} color={lightTheme.info} />
              <Paragraph style={styles.quickStatLabel}>Uptime</Paragraph>
              <Title style={styles.quickStatValue}>99.8%</Title>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* System Status */}
      <Card style={styles.healthCard}>
        <Card.Content>
          <Title style={styles.cardTitle}>System Status</Title>
          <View style={styles.statusGrid}>
            <StatusItem label="Accuracy" value="94.7%" icon="target" color={lightTheme.success} />
            <StatusItem label="Processing" value="2.3s" icon="lightning-bolt" color={lightTheme.info} />
            <StatusItem label="Trend" value="↑ 24%" icon="trending-up" color={lightTheme.warning} />
          </View>
        </Card.Content>
      </Card>

      {/* Detection Trend Chart */}
      <Card style={styles.chartCard}>
        <Card.Content>
          <View style={styles.chartHeader}>
            <MaterialCommunityIcons name="chart-line" size={24} color={lightTheme.primary} />
            <Title style={styles.chartTitle}>Weekly Trends</Title>
          </View>
          <View style={styles.trendChart}>
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, idx) => {
              const values = [120, 150, 140, 180, 200, 165, 190];
              const maxValue = Math.max(...values);
              const height = (values[idx] / maxValue) * 120;
              return (
                <View key={day} style={styles.barContainer}>
                  <View style={[styles.bar, { height: height, backgroundColor: lightTheme.primary }]} />
                  <Paragraph style={styles.barLabel}>{day}</Paragraph>
                </View>
              );
            })}
          </View>
        </Card.Content>
      </Card>

      {/* Detection Distribution */}
      <Card style={styles.chartCard}>
        <Card.Content>
          <View style={styles.chartHeader}>
            <MaterialCommunityIcons name="chart-pie" size={24} color={lightTheme.primary} />
            <Title style={styles.chartTitle}>Detection Breakdown</Title>
          </View>
          <View style={styles.distributionChart}>
            <View style={styles.distributionItem}>
              <View style={[styles.distributionBar, { backgroundColor: lightTheme.success, width: '68%' }]} />
              <View style={styles.distributionLabel}>
                <Paragraph style={styles.distributionName}>Potholes</Paragraph>
                <Title style={styles.distributionValue}>{stats.potholes}</Title>
              </View>
            </View>
            <View style={styles.distributionItem}>
              <View style={[styles.distributionBar, { backgroundColor: lightTheme.warning, width: '23%' }]} />
              <View style={styles.distributionLabel}>
                <Paragraph style={styles.distributionName}>Litter</Paragraph>
                <Title style={styles.distributionValue}>{stats.litter}</Title>
              </View>
            </View>
            <View style={styles.distributionItem}>
              <View style={[styles.distributionBar, { backgroundColor: lightTheme.primary, width: '9%' }]} />
              <View style={styles.distributionLabel}>
                <Paragraph style={styles.distributionName}>Other</Paragraph>
                <Title style={styles.distributionValue}>{stats.otherDamage}</Title>
              </View>
            </View>
          </View>
        </Card.Content>
      </Card>
    </View>
  );
}

function ImagesContent({ images }) {
  return (
    <View style={styles.contentSection}>
      <View style={styles.listHeader}>
        <View>
          <Title style={styles.sectionTitle}>Image Detections</Title>
          <Paragraph style={styles.sectionSubtitle}>Recent analysis results</Paragraph>
        </View>
        <Chip 
          icon="folder-plus" 
          onPress={() => Alert.alert('Upload Image', 'Coming soon')}
          style={styles.actionChip}
        >
          Upload
        </Chip>
      </View>

      {images && images.length > 0 ? (
        <FlatList
          scrollEnabled={false}
          data={images}
          renderItem={({ item }) => (
            <Card style={styles.itemCard}>
              <Card.Content>
                <View style={styles.itemHeader}>
                  <View style={styles.itemIconBg}>
                    <MaterialCommunityIcons name="image" size={24} color="#667eea" />
                  </View>
                  <View style={styles.itemInfo}>
                    <Title style={styles.itemTitle}>{item.title}</Title>
                    <Paragraph style={styles.itemMeta}>
                      {item.detections} object{item.detections !== 1 ? 's' : ''} • {item.timestamp}
                    </Paragraph>
                  </View>
                  <Chip 
                    mode="flat" 
                    style={styles.statusChip}
                    labelStyle={styles.statusChipLabel}
                  >
                    {item.status}
                  </Chip>
                </View>
              </Card.Content>
              <Card.Actions style={styles.cardActions}>
                <Button 
                  icon="eye" 
                  onPress={() => Alert.alert('View', 'Image preview')}
                  compact
                  style={styles.actionButton}
                >
                  View
                </Button>
                <Button 
                  icon="download" 
                  onPress={() => Alert.alert('Download', 'Image downloaded')}
                  compact
                  style={styles.actionButton}
                >
                  Get
                </Button>
              </Card.Actions>
            </Card>
          )}
          keyExtractor={(item) => item.id.toString()}
        />
      ) : (
        <EmptyState icon="image-off" title="No Images" desc="No image detections yet" />
      )}
    </View>
  );
}

function VideosContent({ videos }) {
  return (
    <View style={styles.contentSection}>
      <View style={styles.listHeader}>
        <View>
          <Title style={styles.sectionTitle}>Video Analysis</Title>
          <Paragraph style={styles.sectionSubtitle}>Processed video clips</Paragraph>
        </View>
        <Chip 
          icon="folder-plus" 
          onPress={() => Alert.alert('Upload Video', 'Coming soon')}
          style={styles.actionChip}
        >
          Upload
        </Chip>
      </View>

      {videos && videos.length > 0 ? (
        <FlatList
          scrollEnabled={false}
          data={videos}
          renderItem={({ item }) => (
            <Card style={styles.itemCard}>
              <Card.Content>
                <View style={styles.itemHeader}>
                  <View style={styles.videoIconBg}>
                    <MaterialCommunityIcons name="play-circle" size={24} color="#fff" />
                  </View>
                  <View style={styles.itemInfo}>
                    <Title style={styles.itemTitle}>{item.title}</Title>
                    <Paragraph style={styles.itemMeta}>
                      {item.duration} • {item.detections} detection{item.detections !== 1 ? 's' : ''} • {item.timestamp}
                    </Paragraph>
                  </View>
                  <Chip 
                    mode="flat" 
                    style={styles.statusChip}
                    labelStyle={styles.statusChipLabel}
                  >
                    {item.detections}
                  </Chip>
                </View>
              </Card.Content>
              <Card.Actions style={styles.cardActions}>
                <Button 
                  icon="play" 
                  onPress={() => Alert.alert('Play', 'Video player loading')}
                  compact
                  style={styles.actionButton}
                >
                  Play
                </Button>
                <Button 
                  icon="download" 
                  onPress={() => Alert.alert('Download', 'Video downloaded')}
                  compact
                  style={styles.actionButton}
                >
                  Get
                </Button>
              </Card.Actions>
            </Card>
          )}
          keyExtractor={(item) => item.id.toString()}
        />
      ) : (
        <EmptyState icon="video-off" title="No Videos" desc="No video analysis yet" />
      )}
    </View>
  );
}

function MapContent({ locations }) {
  const [stats, setStats] = useState({
    total: 0,
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
  });

  // Calculate statistics from locations
  useEffect(() => {
    if (Array.isArray(locations)) {
      const validLocations = locations.filter(l => {
        const lat = typeof l.latitude === 'string' ? parseFloat(l.latitude) : l.latitude;
        const lng = typeof l.longitude === 'string' ? parseFloat(l.longitude) : l.longitude;
        return !isNaN(lat) && isFinite(lat) && !isNaN(lng) && isFinite(lng);
      });

      const newStats = {
        total: validLocations.length,
        critical: validLocations.filter(l => l.issues > 60).length,
        high: validLocations.filter(l => l.issues > 35 && l.issues <= 60).length,
        medium: validLocations.filter(l => l.issues > 15 && l.issues <= 35).length,
        low: validLocations.filter(l => l.issues <= 15).length,
      };

      setStats(newStats);
      console.log(`🗺️ Map Statistics: Total=${newStats.total}, Critical=${newStats.critical}`);
    }
  }, [locations]);

  return (
    <View style={styles.contentSection}>
      {/* Header */}
      <View style={styles.listHeader}>
        <View>
          <Title style={styles.sectionTitle}>Detection Map</Title>
          <Paragraph style={styles.sectionSubtitle}>Interactive Leaflet Map - Tap to Open</Paragraph>
        </View>
      </View>

      {/* Statistics Cards */}
      <View style={styles.statsGrid}>
        <StatCard
          title="Total"
          value={stats.total}
          icon="map-marker-multiple"
          color="#667eea"
        />
        <StatCard
          title="Critical"
          value={stats.critical}
          icon="alert"
          color="#ef4444"
        />
        <StatCard
          title="High"
          value={stats.high}
          icon="alert-circle"
          color="#f59e0b"
        />
        <StatCard
          title="Medium"
          value={stats.medium}
          icon="information"
          color="#eab308"
        />
      </View>

      {/* Map Component */}
      <Card style={styles.itemCard}>
        <LeafletMapView locations={locations} />
      </Card>

      {/* Legend */}
      <Card style={[styles.itemCard, styles.legendCard]}>
        <Card.Content>
          <View style={styles.cardHeader}>
            <MaterialCommunityIcons name="information" size={24} color="#667eea" />
            <Title style={styles.cardTitle}>Severity Legend</Title>
          </View>

          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#ef4444' }]} />
            <Paragraph style={styles.legendText}>Critical (61+ issues)</Paragraph>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#f59e0b' }]} />
            <Paragraph style={styles.legendText}>High (36-60 issues)</Paragraph>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#eab308' }]} />
            <Paragraph style={styles.legendText}>Medium (16-35 issues)</Paragraph>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#10b981' }]} />
            <Paragraph style={styles.legendText}>Low (1-15 issues)</Paragraph>
          </View>
        </Card.Content>
      </Card>

      {/* Instructions Card */}
      <Card style={styles.itemCard}>
        <Card.Content>
          <View style={styles.cardHeader}>
            <MaterialCommunityIcons name="help-circle-outline" size={24} color="#667eea" />
            <Title style={styles.cardTitle}>How to Use</Title>
          </View>
          <Paragraph style={styles.infoText}>
            The map opens in your device's native browser when you tap "Open Full Map". This ensures the interactive Leaflet map works perfectly with all features like zooming, panning, and clicking markers.
          </Paragraph>
        </Card.Content>
      </Card>
    </View>
  );
}

function StatCard({ title, value, icon, color }) {
  return (
    <Card style={[styles.statCard, { borderLeftColor: color }]}>
      <Card.Content style={styles.statCardContent}>
        <View style={[styles.statCardIcon, { backgroundColor: color + '15' }]}>
          <MaterialCommunityIcons name={icon} size={28} color={color} />
        </View>
        <View style={styles.statCardInfo}>
          <Paragraph style={styles.statCardTitle}>{title}</Paragraph>
          <Title style={styles.statCardValue}>{value}</Title>
        </View>
      </Card.Content>
    </Card>
  );
}

function MetricRow({ label, value, icon }) {
  return (
    <View style={styles.metricRow}>
      <View style={styles.metricIconBg}>
        <MaterialCommunityIcons name={icon} size={18} color="#667eea" />
      </View>
      <Paragraph style={styles.metricLabel}>{label}</Paragraph>
      <Title style={styles.metricValue}>{value}</Title>
    </View>
  );
}

function StatusItem({ label, value, icon, color }) {
  return (
    <View style={styles.statusItem}>
      <View style={[styles.statusIconBg, { backgroundColor: color + '15' }]}>
        <MaterialCommunityIcons name={icon} size={24} color={color} />
      </View>
      <Paragraph style={styles.statusLabel}>{label}</Paragraph>
      <Title style={styles.statusValueText}>{value}</Title>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: lightTheme.background,
  },
  // Hero Header
  heroHeader: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xxl,
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  heroContent: {
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: typography.h3.fontSize,
    fontWeight: '700',
    color: lightTheme.text.primary,
    marginTop: spacing.md,
  },
  heroSubtitle: {
    fontSize: typography.body.fontSize,
    color: lightTheme.text.secondary,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  tabButtonsContainer: {
    backgroundColor: lightTheme.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    marginBottom: spacing.sm,
    elevation: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tabButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
    flex: 1,
  },
  tabButton: {
    flex: 1,
    borderRadius: borderRadius.lg,
  },
  tabButtonActive: {
    elevation: 3,
  },
  tabButtonLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  logoutButton: {
    marginLeft: spacing.sm,
  },
  content: {
    paddingBottom: spacing.xxl,
  },
  contentSection: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
  },
  /* Header Styles */
  listHeader: {
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.xs,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  sectionTitle: {
    fontSize: typography.h6.fontSize,
    fontWeight: '700',
    color: lightTheme.text.primary,
    marginBottom: spacing.xs,
  },
  sectionSubtitle: {
    fontSize: typography.small.fontSize,
    color: lightTheme.text.secondary,
    marginTop: spacing.xs,
  },
  metricsHeader: {
    marginBottom: spacing.lg,
  },
  /* Card Styles */
  itemCard: {
    marginBottom: spacing.lg,
    elevation: 3,
    borderRadius: borderRadius.lg,
    backgroundColor: lightTheme.surface,
  },
  /* Statistics Grid */
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
    gap: spacing.md,
  },
  statCard: {
    width: '48%',
    elevation: 3,
    borderRadius: borderRadius.lg,
    backgroundColor: lightTheme.surface,
    borderLeftWidth: 4,
  },
  statCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  statCardIcon: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  statCardInfo: {
    flex: 1,
  },
  statCardTitle: {
    fontSize: typography.small.fontSize,
    color: lightTheme.text.secondary,
    fontWeight: '500',
  },
  statCardValue: {
    fontSize: typography.h5.fontSize,
    fontWeight: '700',
    color: lightTheme.text.primary,
    marginTop: spacing.xs,
  },
  /* Quick Stats Grid */
  quickStatsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    justifyContent: 'space-between',
  },
  quickStatItem: {
    width: '48%',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  quickStatLabel: {
    fontSize: typography.small.fontSize,
    color: lightTheme.text.secondary,
    marginTop: spacing.sm,
  },
  quickStatValue: {
    fontSize: typography.h6.fontSize,
    fontWeight: '700',
    color: lightTheme.text.primary,
    marginTop: spacing.xs,
  },
  /* Status Grid */
  statusGrid: {
    marginTop: spacing.lg,
    gap: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statusItem: {
    flexDirection: 'column',
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.md,
  },
  statusIconBg: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  statusItemContent: {
    alignItems: 'center',
  },
  statusLabel: {
    fontSize: typography.small.fontSize,
    color: lightTheme.text.secondary,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  statusValueText: {
    fontSize: typography.h6.fontSize,
    fontWeight: '700',
    textAlign: 'center',
    color: lightTheme.text.primary,
    marginTop: spacing.xs,
  },
  /* Metrics Card */
  metricsCard: {
    marginBottom: spacing.lg,
    elevation: 3,
    borderRadius: borderRadius.lg,
    backgroundColor: lightTheme.surface,
  },
  healthCard: {
    marginBottom: spacing.lg,
    elevation: 3,
    borderRadius: borderRadius.lg,
    backgroundColor: lightTheme.surface,
  },
  chartCard: {
    marginBottom: spacing.lg,
    elevation: 3,
    borderRadius: borderRadius.lg,
    backgroundColor: lightTheme.surface,
  },
  chartHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  chartTitle: {
    fontSize: typography.h6.fontSize,
    fontWeight: '700',
    color: lightTheme.text.primary,
    marginLeft: spacing.md,
  },
  trendChart: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 160,
    paddingBottom: spacing.md,
  },
  barContainer: {
    alignItems: 'center',
    flex: 1,
    marginHorizontal: spacing.xs,
  },
  bar: {
    width: '100%',
    borderRadius: borderRadius.sm,
    marginBottom: spacing.sm,
    minHeight: 8,
  },
  barLabel: {
    fontSize: 10,
    color: lightTheme.text.secondary,
    fontWeight: '600',
  },
  distributionChart: {
    gap: spacing.lg,
  },
  distributionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  distributionBar: {
    height: 24,
    borderRadius: borderRadius.sm,
    minWidth: 20,
  },
  distributionLabel: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  distributionName: {
    fontSize: typography.small.fontSize,
    color: lightTheme.text.secondary,
    fontWeight: '500',
  },
  distributionValue: {
    fontSize: typography.h6.fontSize,
    fontWeight: '700',
    color: lightTheme.text.primary,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  cardTitle: {
    fontSize: typography.h6.fontSize,
    fontWeight: '700',
    color: lightTheme.text.primary,
    marginLeft: spacing.md,
    flex: 1,
  },
  metricRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: `${lightTheme.border}20`,
  },
  metricIconBg: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.md,
    backgroundColor: `${lightTheme.primary}15`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  metricLabel: {
    flex: 1,
    fontSize: typography.small.fontSize,
    color: lightTheme.text.secondary,
    fontWeight: '500',
  },
  metricValue: {
    fontSize: typography.h6.fontSize,
    fontWeight: '700',
    color: lightTheme.text.primary,
  },
  /* Health Status */
  healthItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: `${lightTheme.border}20`,
  },
  healthStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: spacing.md,
  },
  healthLabel: {
    fontSize: typography.small.fontSize,
    color: lightTheme.text.secondary,
    fontWeight: '500',
  },
  healthValue: {
    fontSize: typography.h6.fontSize,
    fontWeight: '700',
    color: lightTheme.success,
  },
  /* Image/Video Items */
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  itemIconBg: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.md,
    backgroundColor: `${lightTheme.primary}15`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoIconBg: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.md,
    backgroundColor: lightTheme.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemInfo: {
    flex: 1,
  },
  itemTitle: {
    fontSize: typography.h6.fontSize,
    fontWeight: '700',
    color: lightTheme.text.primary,
  },
  itemMeta: {
    fontSize: typography.small.fontSize,
    color: lightTheme.text.secondary,
    marginTop: spacing.xs,
  },
  statusChip: {
    backgroundColor: `${lightTheme.success}20`,
    borderColor: lightTheme.success,
    borderWidth: 1,
    borderRadius: borderRadius.md,
  },
  statusChipLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: lightTheme.success,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  actionChip: {
    backgroundColor: `${lightTheme.primary}20`,
  },
  cardActions: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.md,
    gap: spacing.sm,
    flexDirection: 'row',
  },
  actionButton: {
    flex: 1,
    marginHorizontal: spacing.xs,
  },
  /* Map Styles */
  mapContainer: {
    marginHorizontal: -spacing.md,
    marginBottom: spacing.lg,
    overflow: 'hidden',
    borderRadius: 0,
    width: '100%',
  },
  map: {
    width: '100%',
    height: 350,
    backgroundColor: lightTheme.border,
  },
  calloutContainer: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    minWidth: 160,
  },
  calloutTitle: {
    fontSize: typography.h6.fontSize,
    fontWeight: '700',
    color: lightTheme.text.primary,
    marginBottom: spacing.xs,
  },
  calloutText: {
    fontSize: typography.small.fontSize,
    color: lightTheme.primary,
    marginBottom: spacing.xs,
    fontWeight: '600',
  },
  calloutCoords: {
    fontSize: 10,
    color: lightTheme.text.secondary,
    fontWeight: '400',
  },
  /* Legend */
  legendCard: {
    marginBottom: spacing.lg,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    paddingVertical: spacing.xs,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: spacing.md,
  },
  legendText: {
    fontSize: typography.small.fontSize,
    color: lightTheme.text.secondary,
    fontWeight: '500',
  },
  /* Selected Location Detail */
  selectedDetailCard: {
    marginBottom: spacing.lg,
    backgroundColor: `${lightTheme.primary}08`,
    borderColor: lightTheme.primary,
    borderWidth: 1.5,
  },
  selectedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.lg,
  },
  closeButton: {
    margin: -spacing.sm,
  },
  detailsGrid: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  detailItem: {
    flex: 1,
    backgroundColor: lightTheme.surface,
    padding: spacing.md,
    borderRadius: borderRadius.md,
  },
  detailLabel: {
    fontSize: 11,
    color: lightTheme.text.secondary,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.xs,
  },
  detailValue: {
    fontSize: typography.h6.fontSize,
    fontWeight: '700',
    color: lightTheme.primary,
    fontFamily: 'monospace',
  },
  navButton: {
    marginHorizontal: 0,
    marginBottom: 0,
  },
  /* Location List */
  locationCard: {
    borderRadius: borderRadius.lg,
  },
  locationCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  severityBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  severityBadgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
  locationCardInfo: {
    flex: 1,
  },
  issueChip: {
    height: 28,
  },
  /* Selected Card */
  selectedCard: {
    borderColor: lightTheme.primary,
    borderWidth: 2,
    backgroundColor: `${lightTheme.primary}08`,
  },
  /* Empty State */
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxxl,
  },
  emptyTitle: {
    fontSize: typography.h6.fontSize,
    fontWeight: '700',
    color: lightTheme.text.secondary,
    marginTop: spacing.lg,
  },
  emptyDesc: {
    fontSize: typography.small.fontSize,
    color: lightTheme.text.secondary,
    marginTop: spacing.md,
    textAlign: 'center',
    maxWidth: 200,
  },
  /* Map Styles */
  mapContainer: {
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    marginBottom: spacing.lg,
    elevation: 2,
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  map: {
    flex: 1,
    backgroundColor: lightTheme.border,
  },
  infoText: {
    fontSize: typography.small.fontSize,
    color: lightTheme.text.secondary,
    marginTop: spacing.md,
    lineHeight: 18,
  },
});

