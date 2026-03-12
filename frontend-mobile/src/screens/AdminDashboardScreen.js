import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, FlatList, Alert } from 'react-native';
import { Card, Title, Paragraph, Button, Chip, Menu } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MapView, { Marker, Callout, UrlTile } from 'react-native-maps';
import { API_BASE_URL } from '../services/api';

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
      buttonColor={active ? '#667eea' : undefined}
      textColor={active ? '#fff' : '#667eea'}
      labelStyle={styles.tabButtonLabel}
    >
      {label}
    </Button>
  );
}

// Generate 100 random locations from backend, with local fallback
async function fetchRandomLocations() {
  try {
    console.log('Attempting to fetch locations from backend...', `URL: ${API_BASE_URL}/potholes/locations`);
    const response = await fetch(`${API_BASE_URL}/potholes/locations`, { 
      timeout: 5000 
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    console.log('Successfully fetched locations from backend:', data?.length || 0, 'items');
    return data;
  } catch (error) {
    console.warn('Failed to fetch from backend, using local data:', error.message);
    // Fallback: Generate locations locally
    return generateLocalLocations();
  }
}

// Generate 100 random locations locally as fallback
function generateLocalLocations() {
  const areaNames = [
    "Downtown District", "Highway Zone", "Suburbs", "Market Street", "Park Avenue",
    "Main Street", "Broadway", "Central Park", "Fifth Avenue", "Wall Street",
    "Times Square", "Brooklyn Heights", "Queens", "Harlem", "Upper East Side",
    "Lower East Side", "West Village", "Chelsea", "Midtown", "Financial District",
    "SoHo", "TriBeCa", "Chinatown", "Little Italy", "Nolita",
    "East Village", "NoHo", "Gramercy", "Flatiron", "Murray Hill",
    "Kips Bay", "Stuyvesant Town", "Astoria", "Long Island City", "Williamsburg",
    "Greenpoint", "Bushwick", "Bed-Stuy", "Crown Heights", "Park Slope",
    "Prospect Heights", "Washington Heights", "Inwood", "Jackson Heights", "Bayside",
    "Flushing", "Elmhurst", "Jackson Heights", "Woodside", "Corona",
    "Astoria", "Long Island City", "Ditmars", "Sunnyside", "Hunters Point",
    "Alphabet City", "East Side", "Stuyvesant", "Grammercy", "Madison",
    "Park", "Central", "Riverside", "Upper West", "Upper East",
    "Mid West", "Mid Town", "Lower East", "Lower West", "Financial",
    "South", "North", "East", "West", "Central East",
    "Central West", "North East", "North West", "South East", "South West",
    "Harbor", "Bridge", "Park", "Heights", "Heights East", "Heights West",
    "Ridge", "Ridge East", "Valley", "Summit", "Garden", "Garden City",
    "Prospect", "Prospect Park", "Riverside Park", "Central Park", "Madison Park"
  ];

  const locations = [];
  const baseLat = 17.385044;
  const baseLng = 78.486671;

  for (let i = 0; i < 100; i++) {
    const lat = (baseLat + (Math.random() - 0.5) * 0.3).toFixed(6);
    const lng = (baseLng + (Math.random() - 0.5) * 0.3).toFixed(6);
    const issues = Math.floor(Math.random() * 75) + 5;
    
    locations.push({
      id: i + 1,
      area: areaNames[i % areaNames.length] + ' ' + (Math.floor(i / areaNames.length) + 1),
      lat: lat,
      lng: lng,
      issues: issues,
      severity: issues > 20 ? 'Critical' : issues > 10 ? 'High' : 'Moderate'
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
    // Fetch locations from backend
    fetchRandomLocations().then(data => {
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
      {/* Enhanced Header with Gradient Background */}
      <View style={styles.headerBackground}>
        <View style={styles.headerOverlay} />
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Title style={styles.headerTitle}>Dashboard</Title>
            <Paragraph style={styles.headerSubtitle}>System Analytics & Monitoring</Paragraph>
          </View>
          
          <Menu
            visible={menuVisible}
            onDismiss={() => setMenuVisible(false)}
            anchor={
              <Button
                icon="menu"
                onPress={() => setMenuVisible(true)}
                textColor="#fff"
              />
            }
          >
            <Menu.Item
              onPress={handleLogout}
              title="Logout"
              leadingIcon="logout"
            />
          </Menu>
        </View>
      </View>

      {/* Enhanced Tab Buttons */}
      <View style={styles.tabButtonsContainer}>
        <View style={styles.tabButtons}>
          <TabButton
            active={activeTab === 'stats'}
            onPress={() => setActiveTab('stats')}
            icon="chart-line"
            label="Stats"
          />
          <TabButton
            active={activeTab === 'images'}
            onPress={() => setActiveTab('images')}
            icon="image-multiple"
            label="Images"
          />
          <TabButton
            active={activeTab === 'videos'}
            onPress={() => setActiveTab('videos')}
            icon="video"
            label="Videos"
          />
          <TabButton
            active={activeTab === 'location'}
            onPress={() => setActiveTab('location')}
            icon="map-marker-multiple"
            label="Locations"
          />
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {activeTab === 'stats' && <StatisticsContent stats={stats} />}
        {activeTab === 'images' && <ImagesContent images={images} />}
        {activeTab === 'videos' && <VideosContent videos={videos} />}
        {activeTab === 'location' && <LocationContent locations={locations} />}
      </View>
    </ScrollView>
  );
}

function StatisticsContent({ stats }) {
  return (
    <View style={styles.contentSection}>
      {/* Key Metrics Grid */}
      <View style={styles.metricsHeader}>
        <Title style={styles.sectionTitle}>Key Metrics</Title>
        <Paragraph style={styles.sectionSubtitle}>Real-time system statistics</Paragraph>
      </View>
      
      <View style={styles.statsGrid}>
        <StatCard
          title="Total Detections"
          value={stats.totalDetections}
          icon="check-circle"
          color="#10b981"
        />
        <StatCard
          title="Potholes Found"
          value={stats.potholes}
          icon="pot-mix"
          color="#ef4444"
        />
        <StatCard
          title="Litter Items"
          value={stats.litter}
          icon="trash-can"
          color="#f59e0b"
        />
        <StatCard
          title="Other Damage"
          value={stats.otherDamage}
          icon="alert-circle"
          color="#667eea"
        />
      </View>

      {/* Performance Metrics Card */}
      <Card style={styles.metricsCard}>
        <Card.Content>
          <View style={styles.cardHeader}>
            <MaterialCommunityIcons name="speedometer" size={24} color="#667eea" />
            <Title style={styles.cardTitle}>Performance</Title>
          </View>
          
          <MetricRow label="Active Users" value={stats.activeUsers} icon="account-multiple" />
          <MetricRow label="Reports Resolved" value={stats.reportsResolved} icon="check-all" />
          <MetricRow label="Avg Latency" value={`${stats.averageLatency}ms`} icon="clock-fast" />
          <MetricRow label="Uptime" value="99.8%" icon="server-network" />
        </Card.Content>
      </Card>

      {/* System Health Card */}
      <Card style={styles.healthCard}>
        <Card.Content>
          <View style={styles.cardHeader}>
            <MaterialCommunityIcons name="heart-pulse" size={24} color="#10b981" />
            <Title style={styles.cardTitle}>System Health</Title>
          </View>
          
          <View style={styles.healthItem}>
            <View style={styles.healthStatus}>
              <View style={[styles.statusDot, { backgroundColor: '#10b981' }]} />
              <Paragraph style={styles.healthLabel}>Detection Accuracy</Paragraph>
            </View>
            <Paragraph style={styles.healthValue}>94.7%</Paragraph>
          </View>
          
          <View style={styles.healthItem}>
            <View style={styles.healthStatus}>
              <View style={[styles.statusDot, { backgroundColor: '#10b981' }]} />
              <Paragraph style={styles.healthLabel}>Processing Time</Paragraph>
            </View>
            <Paragraph style={styles.healthValue}>2.3s avg</Paragraph>
          </View>
          
          <View style={styles.healthItem}>
            <View style={styles.healthStatus}>
              <View style={[styles.statusDot, { backgroundColor: '#10b981' }]} />
              <Paragraph style={styles.healthLabel}>Detection Trend</Paragraph>
            </View>
            <Paragraph style={styles.healthValue}>↑ 24% this week</Paragraph>
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
                  <Chip mode="flat" style={styles.statusChip}>
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
                  <Chip mode="flat" style={styles.statusChip}>
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

function LocationContent({ locations }) {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [mapRegion, setMapRegion] = useState({
    latitude: 17.385044,
    longitude: 78.486671,
    latitudeDelta: 0.5,
    longitudeDelta: 0.5,
  });

  useEffect(() => {
    if (locations && locations.length > 0) {
      try {
        const lats = locations
          .map(l => parseFloat(l.lat))
          .filter(lat => !isNaN(lat) && isFinite(lat));
        const lngs = locations
          .map(l => parseFloat(l.lng))
          .filter(lng => !isNaN(lng) && isFinite(lng));

        if (lats.length > 0 && lngs.length > 0) {
          const minLat = Math.min(...lats);
          const maxLat = Math.max(...lats);
          const minLng = Math.min(...lngs);
          const maxLng = Math.max(...lngs);

          const latDelta = Math.max(maxLat - minLat, 0.01) * 1.5;
          const lngDelta = Math.max(maxLng - minLng, 0.01) * 1.5;

          setMapRegion({
            latitude: (minLat + maxLat) / 2,
            longitude: (minLng + maxLng) / 2,
            latitudeDelta: latDelta,
            longitudeDelta: lngDelta,
          });
        }
      } catch (error) {
        console.error('Error calculating map region:', error);
      }
    }
  }, [locations]);

  return (
    <View style={styles.contentSection}>
      {/* Header */}
      <View style={styles.listHeader}>
        <View>
          <Title style={styles.sectionTitle}>Detected Locations</Title>
          <Paragraph style={styles.sectionSubtitle}>Real-time map and locations</Paragraph>
        </View>
      </View>

      {/* Interactive Map */}
      <Card style={[styles.mapContainer, styles.itemCard]}>
        <MapView
          style={styles.map}
          region={mapRegion}
          onRegionChange={setMapRegion}
          provider={null}
          scrollEnabled={true}
          zoomEnabled={true}
          pitchEnabled={false}
          rotateEnabled={false}
        >
          <UrlTile
            urlTemplate="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
            maximumZ={19}
            minimumZ={0}
            tileSize={256}
            attribution="&copy; OpenStreetMap contributors"
          />
          {locations && locations.map((location) => (
            <Marker
              key={location.id}
              coordinate={{
                latitude: parseFloat(location.lat),
                longitude: parseFloat(location.lng),
              }}
              title={location.area}
              description={`${location.issues} issues detected`}
              pinColor={location.issues > 20 ? '#ef4444' : location.issues > 10 ? '#f59e0b' : '#10b981'}
              onPress={() => setSelectedLocation(location)}
            >
              <Callout>
                <View style={styles.calloutContainer}>
                  <Title style={styles.calloutTitle}>{location.area}</Title>
                  <Paragraph style={styles.calloutText}>{location.issues} issues reported</Paragraph>
                  <Paragraph style={styles.calloutCoords}>{location.lat}, {location.lng}</Paragraph>
                </View>
              </Callout>
            </Marker>
          ))}
        </MapView>
      </Card>

      {/* Severity Legend Card */}
      <Card style={[styles.itemCard, styles.legendCard]}>
        <Card.Content>
          <View style={styles.cardHeader}>
            <MaterialCommunityIcons name="shield-alert" size={24} color="#ef4444" />
            <Title style={styles.cardTitle}>Issue Severity</Title>
          </View>
          
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#ef4444' }]} />
            <Paragraph style={styles.legendText}>Critical (20+ issues)</Paragraph>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#f59e0b' }]} />
            <Paragraph style={styles.legendText}>High (10-19 issues)</Paragraph>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#10b981' }]} />
            <Paragraph style={styles.legendText}>Moderate (&lt;10 issues)</Paragraph>
          </View>
        </Card.Content>
      </Card>

      {/* Selected Location Details */}
      {selectedLocation && (
        <Card style={[styles.itemCard, styles.selectedDetailCard]}>
          <Card.Content>
            <View style={styles.selectedHeader}>
              <View>
                <Title style={styles.itemTitle}>{selectedLocation.area}</Title>
                <Paragraph style={styles.itemMeta}>
                  {selectedLocation.issues} issue{selectedLocation.issues !== 1 ? 's' : ''} detected
                </Paragraph>
              </View>
              <Button
                icon="close"
                onPress={() => setSelectedLocation(null)}
                compact
                style={styles.closeButton}
              />
            </View>

            <View style={styles.detailsGrid}>
              <View style={styles.detailItem}>
                <Paragraph style={styles.detailLabel}>Latitude</Paragraph>
                <Paragraph style={styles.detailValue}>{selectedLocation.lat}</Paragraph>
              </View>
              <View style={styles.detailItem}>
                <Paragraph style={styles.detailLabel}>Longitude</Paragraph>
                <Paragraph style={styles.detailValue}>{selectedLocation.lng}</Paragraph>
              </View>
            </View>

            <Button
              mode="contained"
              icon="directions"
              onPress={() => Alert.alert('Navigation', `Opening directions to ${selectedLocation.area}...`)}
              style={styles.navButton}
              buttonColor="#667eea"
            >
              Navigate to Area
            </Button>
          </Card.Content>
        </Card>
      )}

      {/* All Locations List */}
      <View style={styles.locationsHeader}>
        <Title style={styles.sectionTitle}>All Areas</Title>
        <Paragraph style={styles.sectionSubtitle}>{locations?.length || 0} location{locations?.length !== 1 ? 's' : ''}</Paragraph>
      </View>

      {locations && locations.length > 0 ? (
        <FlatList
          scrollEnabled={false}
          data={locations}
          renderItem={({ item }) => {
            const getSeverityColor = (issues) => {
              if (issues > 20) return '#ef4444';
              if (issues > 10) return '#f59e0b';
              return '#10b981';
            };

            const getSeverityLabel = (issues) => {
              if (issues > 20) return 'Critical';
              if (issues > 10) return 'High';
              return 'Moderate';
            };

            return (
              <Card
                style={[
                  styles.itemCard,
                  styles.locationCard,
                  selectedLocation?.id === item.id && styles.selectedCard,
                ]}
                onPress={() => setSelectedLocation(item)}
              >
                <Card.Content>
                  <View style={styles.locationCardHeader}>
                    <View style={[styles.severityBadge, { backgroundColor: getSeverityColor(item.issues) }]}>
                      <Paragraph style={styles.severityBadgeText}>{getSeverityLabel(item.issues)}</Paragraph>
                    </View>
                    <View style={styles.locationCardInfo}>
                      <Title style={styles.itemTitle}>{item.area}</Title>
                      <Paragraph style={styles.itemMeta}>
                        {item.issues} issue{item.issues !== 1 ? 's' : ''} • Lat: {item.lat.substring(0, 8)}
                      </Paragraph>
                    </View>
                    <Chip mode="flat" style={[styles.issueChip, { backgroundColor: getSeverityColor(item.issues) + '20' }]}>
                      {item.issues}
                    </Chip>
                  </View>
                </Card.Content>
                <Card.Actions style={styles.cardActions}>
                  <Button
                    icon="map-marker"
                    onPress={() => setSelectedLocation(item)}
                    compact
                    style={styles.actionButton}
                  >
                    View
                  </Button>
                  <Button
                    icon="directions"
                    onPress={() => Alert.alert('Navigation', `Opening directions to ${item.area}...`)}
                    compact
                    style={styles.actionButton}
                  >
                    Go
                  </Button>
                </Card.Actions>
              </Card>
            );
          }}
          keyExtractor={(item) => item.id.toString()}
        />
      ) : (
        <EmptyState icon="alert-circle-outline" title="No Locations" desc="No detection locations yet" />
      )}
    </View>
  );
}

function StatCard({ title, value, icon, color }) {
  return (
    <Card style={[styles.statCard, { borderLeftColor: color, borderLeftWidth: 4 }]}>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  headerBackground: {
    backgroundColor: '#667eea',
    paddingBottom: 30,
    position: 'relative',
  },
  headerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.08)',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 1,
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
  headerSubtitle: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 12,
    marginTop: 2,
  },
  tabButtonsContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 4,
    elevation: 1,
  },
  tabButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  tabButton: {
    flex: 1,
    borderRadius: 8,
  },
  tabButtonActive: {
    elevation: 2,
  },
  tabButtonLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  content: {
    paddingBottom: 20,
  },
  contentSection: {
    paddingHorizontal: 12,
    paddingTop: 12,
  },
  /* Header Styles */
  listHeader: {
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 2,
  },
  locationsHeader: {
    marginBottom: 12,
    marginTop: 16,
    paddingHorizontal: 4,
  },
  metricsHeader: {
    marginBottom: 12,
  },
  /* Card Styles */
  itemCard: {
    marginBottom: 12,
    elevation: 2,
    borderRadius: 12,
  },
  card: {
    marginBottom: 12,
    elevation: 2,
  },
  /* Statistics Grid */
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 12,
  },
  statCard: {
    width: '48.5%',
    elevation: 2,
    borderRadius: 12,
  },
  statCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statCardIcon: {
    width: 44,
    height: 44,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  statCardInfo: {
    flex: 1,
  },
  statCardTitle: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  statCardValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1f2937',
    marginTop: 2,
  },
  /* Metrics Card */
  metricsCard: {
    marginBottom: 12,
    elevation: 2,
    borderRadius: 12,
  },
  healthCard: {
    marginBottom: 12,
    elevation: 2,
    borderRadius: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
    marginLeft: 12,
    flex: 1,
  },
  metricRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  metricRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  metricIconBg: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#667eea15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  metricLabel: {
    flex: 1,
    fontSize: 13,
    color: '#6b7280',
    fontWeight: '500',
  },
  metricValue: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1f2937',
  },
  /* Health Status */
  healthItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
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
    marginRight: 10,
  },
  healthLabel: {
    fontSize: 13,
    color: '#6b7280',
    fontWeight: '500',
  },
  healthValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#10b981',
  },
  /* Image/Video Items */
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  itemIconBg: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: '#667eea15',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoIconBg: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: '#667eea',
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemInfo: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1f2937',
  },
  itemMeta: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  statusChip: {
    height: 28,
    backgroundColor: '#10b98120',
  },
  actionChip: {
    backgroundColor: '#667eea20',
  },
  cardActions: {
    paddingHorizontal: 0,
    paddingRight: 8,
    gap: 4,
  },
  actionButton: {
    marginHorizontal: 0,
  },
  /* Map Styles */
  mapContainer: {
    marginHorizontal: -12,
    marginBottom: 12,
    overflow: 'hidden',
    borderRadius: 0,
    width: '100%',
  },
  map: {
    width: '100%',
    height: 350,
    backgroundColor: '#e8e8e8',
  },
  calloutContainer: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    minWidth: 160,
  },
  calloutTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 4,
  },
  calloutText: {
    fontSize: 12,
    color: '#667eea',
    marginBottom: 4,
    fontWeight: '600',
  },
  calloutCoords: {
    fontSize: 10,
    color: '#9ca3af',
    fontWeight: '400',
  },
  /* Legend */
  legendCard: {
    marginBottom: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    paddingVertical: 4,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 10,
  },
  legendText: {
    fontSize: 13,
    color: '#6b7280',
    fontWeight: '500',
  },
  /* Selected Location Detail */
  selectedDetailCard: {
    marginBottom: 12,
    backgroundColor: '#f0f4ff',
    borderColor: '#667eea',
    borderWidth: 1.5,
  },
  selectedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  closeButton: {
    margin: -8,
  },
  detailsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  detailItem: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
  },
  detailLabel: {
    fontSize: 11,
    color: '#9ca3af',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#667eea',
    fontFamily: 'monospace',
  },
  navButton: {
    marginHorizontal: 0,
    marginBottom: 0,
  },
  /* Location List */
  locationCard: {
    borderRadius: 12,
  },
  locationCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  severityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
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
    borderColor: '#667eea',
    borderWidth: 2,
    backgroundColor: '#f0f4ff',
  },
  /* Empty State */
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#6b7280',
    marginTop: 16,
  },
  emptyDesc: {
    fontSize: 13,
    color: '#9ca3af',
    marginTop: 8,
    textAlign: 'center',
    maxWidth: 200,
  },
});

