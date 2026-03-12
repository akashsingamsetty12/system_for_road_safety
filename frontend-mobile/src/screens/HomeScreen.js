import React from 'react';
import { ScrollView, View, StyleSheet, Dimensions } from 'react-native';
import { Card, Title, Paragraph, Button, Chip } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default function HomeScreen({ navigation }) {
  const features = [
    { icon: 'image', title: 'Image Detection', desc: 'Capture or upload photos' },
    { icon: 'video', title: 'Video Detection', desc: 'Analyze video files' },
    { icon: 'movie', title: 'Live Detection', desc: 'Real-time video stream' },
    { icon: 'map-marker', title: 'Location Tracking', desc: 'GPS-based detection' },
  ];

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <MaterialCommunityIcons name="road" size={60} color="#fff" />
        <Title style={styles.headerTitle}>Road Detection System</Title>
        <Paragraph style={styles.headerSubtitle}>
          Detect potholes, litter, and road damage with AI
        </Paragraph>
      </View>

      {/* Quick Start */}
      <View style={styles.section}>
        <Title style={styles.sectionTitle}>🚀 Quick Start (4 Steps)</Title>
        <Card style={styles.quickStartCard}>
          <Card.Content>
            <QuickStartItem number="1" text="Choose detection method" icon="image-multiple" />
            <QuickStartItem number="2" text="Capture or upload media" icon="upload" />
            <QuickStartItem number="3" text="View instant AI results" icon="lightbulb" />
            <QuickStartItem number="4" text="Share to help your community" icon="share-variant" />
          </Card.Content>
        </Card>
      </View>

      {/* Features */}
      <View style={styles.section}>
        <Title style={styles.sectionTitle}>Key Features</Title>
        {features.map((feature, index) => (
          <Card key={index} style={styles.featureCard}>
            <Card.Content style={styles.featureContent}>
              <View style={styles.featureIcon}>
                <MaterialCommunityIcons name={feature.icon} size={32} color="#667eea" />
              </View>
              <View style={styles.featureText}>
                <Title style={styles.featureTitle}>{feature.title}</Title>
                <Paragraph style={styles.featureDesc}>{feature.desc}</Paragraph>
              </View>
            </Card.Content>
          </Card>
        ))}
      </View>

      {/* Detection Classes */}
      <View style={styles.section}>
        <Title style={styles.sectionTitle}>Detectable Objects</Title>
        <View style={styles.chipsContainer}>
          <Chip icon="pot-mix" style={styles.chip}>Pothole</Chip>
          <Chip icon="leaf" style={styles.chip}>Plastic</Chip>
          <Chip icon="trash-can" style={styles.chip}>Litter</Chip>
        </View>
      </View>

      {/* Statistics */}
      <View style={styles.statsContainer}>
        <StatCard title="Detections" value="1,845" icon="check-circle" />
        <StatCard title="Coverage" value="12 km²" icon="map-outline" />
        <StatCard title="Active Users" value="342" icon="account-multiple" />
      </View>

      {/* Info Buttons */}
      <View style={styles.actionButtons}>
        <Button
          mode="outlined"
          onPress={() => navigation.navigate('About')}
          style={styles.button}
        >
          📖 About App
        </Button>
        <Button
          mode="outlined"
          onPress={() => navigation.navigate('Rewards')}
          style={styles.button}
        >
          🎁 Rewards
        </Button>
      </View>

      {/* Admin Button */}
      <View style={styles.adminButtonContainer}>
        <Button
          mode="contained"
          onPress={() => navigation.navigate('AdminLogin')}
          style={styles.adminButton}
          buttonColor="#667eea"
          icon="lock"
        >
          🔐 Admin Portal
        </Button>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Paragraph style={styles.footerText}>
          Privacy Policy • Terms of Service • Help
        </Paragraph>
        <Paragraph style={styles.footerVersion}>
          Version 1.0.0
        </Paragraph>
      </View>
    </ScrollView>
  );
}

function StatCard({ title, value, icon }) {
  return (
    <Card style={styles.statCard}>
      <Card.Content style={styles.statContent}>
        <View style={styles.statIcon}>
          <MaterialCommunityIcons name={icon} size={24} color="#667eea" />
        </View>
        <View>
          <Paragraph style={styles.statTitle}>{title}</Paragraph>
          <Title style={styles.statValue}>{value}</Title>
        </View>
      </Card.Content>
    </Card>
  );
}

function QuickStartItem({ number, text, icon }) {
  return (
    <View style={styles.quickStartItem}>
      <View style={styles.quickStartNumber}>
        <Paragraph style={styles.quickStartNumberText}>{number}</Paragraph>
      </View>
      <MaterialCommunityIcons name={icon} size={24} color="#667eea" style={styles.quickStartIcon} />
      <Paragraph style={styles.quickStartText}>{text}</Paragraph>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#667eea',
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
  },
  headerSubtitle: {
    color: 'rgba(255,255,255,0.9)',
    marginTop: 8,
    fontSize: 14,
  },
  section: {
    paddingHorizontal: 16,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  featureCard: {
    marginBottom: 12,
    elevation: 2,
  },
  featureContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },
  featureIcon: {
    marginRight: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  featureDesc: {
    fontSize: 13,
    color: '#666',
    marginTop: 4,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  chip: {
    backgroundColor: '#eef2ff',
    marginBottom: 8,
  },
  statsContainer: {
    paddingHorizontal: 16,
    marginVertical: 24,
  },
  statCard: {
    marginBottom: 12,
    elevation: 2,
  },
  statContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statIcon: {
    marginRight: 16,
  },
  statTitle: {
    fontSize: 13,
    color: '#999',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#667eea',
  },
  actionButtons: {
    paddingHorizontal: 16,
    marginBottom: 24,
    gap: 10,
  },
  button: {
    borderColor: '#667eea',
    paddingVertical: 6,
  },
  adminButtonContainer: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  adminButton: {
    paddingVertical: 8,
    borderRadius: 8,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    marginTop: 20,
  },
  footerText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  },
  footerVersion: {
    fontSize: 12,
    color: '#ccc',
    marginTop: 8,
  },
  quickStartCard: {
    marginBottom: 16,
    elevation: 2,
    backgroundColor: '#f0f4ff',
  },
  quickStartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e7ff',
  },
  quickStartNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#667eea',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  quickStartNumberText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  quickStartIcon: {
    marginRight: 12,
    color: '#667eea',
  },
  quickStartText: {
    flex: 1,
    fontSize: 13,
    color: '#333',
    fontWeight: '500',
  },
});
