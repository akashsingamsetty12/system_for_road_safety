import React from 'react';
import { ScrollView, View, StyleSheet, Dimensions } from 'react-native';
import { Card, Title, Paragraph, Button, Chip } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { lightTheme, spacing, typography, borderRadius } from '../config/theme';

const screenWidth = Dimensions.get('window').width;

export default function HomeScreen({ navigation }) {
  const features = [
    { icon: 'image-multiple', title: 'Image Detection', desc: 'Capture or upload photos for analysis' },
    { icon: 'video', title: 'Video Detection', desc: 'Process video files for detection' },
    { icon: 'play-circle', title: 'Live Detection', desc: 'Real-time video stream analysis' },
    { icon: 'map-marker-radius', title: 'Location Tracking', desc: 'GPS-based detection mapping' },
  ];

  const stats = [
    { icon: 'check-circle-outline', title: 'Detections', value: '1,845' },
    { icon: 'map-outline', title: 'Coverage', value: '12 km²' },
    { icon: 'account-multiple', title: 'Users', value: '342' },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Hero Header */}
      <View style={styles.heroHeader}>
        <View style={styles.heroContent}>
          <MaterialCommunityIcons name="road-variant" size={48} color={lightTheme.primary} />
          <Title style={styles.heroTitle}>Road Detection</Title>
          <Paragraph style={styles.heroSubtitle}>
            Intelligent AI-powered road damage detection system
          </Paragraph>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActionsSection}>
        <Title style={styles.sectionTitle}>Get Started</Title>
        <View style={styles.quickActionsGrid}>
          <QuickActionCard 
            icon="camera"
            label="Capture"
            color={lightTheme.primary}
            onPress={() => navigation.getParent()?.navigate('Image')}
          />
          <QuickActionCard 
            icon="folder-open"
            label="Upload"
            color={lightTheme.secondary}
            onPress={() => navigation.getParent()?.navigate('Image')}
          />
          <QuickActionCard 
            icon="video-box"
            label="Video"
            color={lightTheme.success}
            onPress={() => navigation.getParent()?.navigate('Video')}
          />
          <QuickActionCard 
            icon="map-marker"
            label="Live"
            color={lightTheme.warning}
            onPress={() => navigation.getParent()?.navigate('Live')}
          />
        </View>
      </View>

      {/* Features List */}
      <View style={styles.featuresSection}>
        <Title style={styles.sectionTitle}>Core Features</Title>
        {features.map((feature, index) => (
          <FeatureCard key={index} {...feature} />
        ))}

      </View>

      {/* Detection Classes */}
      <View style={styles.classesSection}>
        <Title style={styles.sectionTitle}>What Can We Detect</Title>
        <View style={styles.classesGrid}>
          <ClassChip label="Road Damage" icon="alert-circle" color={lightTheme.danger} />
          <ClassChip label="Water" icon="water" color={lightTheme.info} />
          <ClassChip label="Debris" icon="alert" color={lightTheme.warning} />
        </View>
      </View>

      {/* Statistics */}
      <View style={styles.statsSection}>
        <Title style={styles.sectionTitle}>System Statistics</Title>
        <View style={styles.statsGrid}>
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtonsSection}>
        <Button
          mode="contained"
          onPress={() => navigation.getParent()?.navigate('Image')}
          style={styles.primaryButton}
          buttonColor={lightTheme.primary}
          labelStyle={styles.buttonLabel}
          icon="play-circle"
        >
          START DETECTION
        </Button>
      </View>

      {/* Secondary Links */}
      <View style={styles.secondaryLinksSection}>
        <Button
          mode="text"
          onPress={() => navigation.navigate('About')}
          style={styles.textButton}
          labelStyle={{ color: lightTheme.primary }}
        >
          About Application
        </Button>
        <Button
          mode="text"
          onPress={() => navigation.navigate('Rewards')}
          style={styles.textButton}
          labelStyle={{ color: lightTheme.primary }}
        >
          Rewards Program
        </Button>
      </View>

      {/* Admin Portal */}
      <View style={styles.adminSection}>
        <Button
          mode="outlined"
          onPress={() => navigation.navigate('AdminDashboard')}
          style={styles.adminButton}
          labelStyle={{ color: lightTheme.primary }}
          icon="security"
        >
          ADMIN PORTAL
        </Button>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Paragraph style={styles.footerText}>Version 1.0 • Developed with Can't Win</Paragraph>
      </View>
    </ScrollView>
  );
}

function QuickActionCard({ icon, label, color, onPress }) {
  return (
    <Button
      mode="outlined"
      onPress={onPress}
      style={[styles.quickActionCard, { borderColor: color }]}
      labelStyle={{ color, fontSize: 11, fontWeight: '600' }}
      icon={icon}
    >
      {label}
    </Button>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <View style={styles.featureCard}>
      <View style={styles.featureIconContainer}>
        <MaterialCommunityIcons name={icon} size={24} color={lightTheme.primary} />
      </View>
      <View style={styles.featureContent}>
        <Title style={styles.featureTitle}>{title}</Title>
        <Paragraph style={styles.featureDesc}>{desc}</Paragraph>
      </View>
      <MaterialCommunityIcons name="chevron-right" size={20} color={lightTheme.border} />
    </View>
  );
}

function ClassChip({ label, icon, color }) {
  return (
    <View style={[styles.classChip, { borderColor: color }]}>
      <MaterialCommunityIcons name={icon} size={16} color={color} />
      <Paragraph style={[styles.classChipLabel, { color }]}>{label}</Paragraph>
    </View>
  );
}

function StatCard({ icon, title, value }) {
  return (
    <View style={styles.statCard}>
      <View style={styles.statIconContainer}>
        <MaterialCommunityIcons name={icon} size={20} color={lightTheme.primary} />
      </View>
      <Paragraph style={styles.statLabel}>{title}</Paragraph>
      <Title style={styles.statValue}>{value}</Title>
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
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: typography.body.fontSize,
    color: lightTheme.text.secondary,
    textAlign: 'center',
    maxWidth: 300,
  },

  // Quick Actions
  quickActionsSection: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    justifyContent: 'space-between',
  },
  quickActionCard: {
    width: '48%',
    borderRadius: borderRadius.md,
    borderWidth: 1.5,
  },

  // Features Section
  featuresSection: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    backgroundColor: lightTheme.surface,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
    gap: spacing.md,
  },
  featureIconContainer: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    backgroundColor: `${lightTheme.primary}15`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: typography.h6.fontSize,
    fontWeight: typography.h6.fontWeight,
    color: lightTheme.text.primary,
  },
  featureDesc: {
    fontSize: typography.small.fontSize,
    color: lightTheme.text.secondary,
    marginTop: 2,
  },

  // Classes Section
  classesSection: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    backgroundColor: lightTheme.surface,
  },
  classesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  classChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    borderWidth: 1.5,
    gap: spacing.sm,
  },
  classChipLabel: {
    fontSize: typography.small.fontSize,
    fontWeight: typography.smallMedium.fontWeight,
  },

  // Stats Section
  statsSection: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: spacing.md,
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    backgroundColor: lightTheme.surface,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    gap: spacing.sm,
  },
  statIconContainer: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.full,
    backgroundColor: `${lightTheme.primary}20`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statLabel: {
    fontSize: typography.caption.fontSize,
    color: lightTheme.text.secondary,
  },
  statValue: {
    fontSize: typography.h5.fontSize,
    fontWeight: typography.h5.fontWeight,
    color: lightTheme.text.primary,
  },

  // Action Buttons
  actionButtonsSection: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
    gap: spacing.md,
  },
  primaryButton: {
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.sm,
  },
  buttonLabel: {
    fontSize: typography.bodyMedium.fontSize,
    fontWeight: typography.bodyMedium.fontWeight,
  },

  // Secondary Links
  secondaryLinksSection: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    gap: spacing.sm,
  },
  textButton: {
    borderRadius: borderRadius.md,
  },

  // Admin Section
  adminSection: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    backgroundColor: lightTheme.surface,
  },
  adminButton: {
    borderRadius: borderRadius.lg,
    borderColor: lightTheme.primary,
    borderWidth: 1.5,
  },

  // Section Title
  sectionTitle: {
    fontSize: typography.h4.fontSize,
    fontWeight: typography.h4.fontWeight,
    color: lightTheme.text.primary,
    marginBottom: spacing.md,
  },

  // Footer
  footer: {
    paddingVertical: spacing.xxl,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: lightTheme.border,
  },
  footerText: {
    fontSize: typography.small.fontSize,
    color: lightTheme.text.tertiary,
  },
});
