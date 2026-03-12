import React from 'react';
import { ScrollView, View, StyleSheet, Linking } from 'react-native';
import { Card, Title, Paragraph, Button, Divider } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default function AboutScreen({ navigation }) {
  const openUrl = (url) => {
    Linking.openURL(url).catch((err) =>
      console.error('Failed to open URL:', err)
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <MaterialCommunityIcons name="road" size={80} color="#667eea" />
        <Title style={styles.appTitle}>Road Detection System</Title>
        <Paragraph style={styles.version}>Version 1.0.0</Paragraph>
      </View>

      {/* Description */}
      <Card style={styles.descriptionCard}>
        <Card.Content>
          <Title>About This App</Title>
          <Divider style={styles.divider} />
          <Paragraph style={styles.descText}>
            Road Detection System is a community-driven mobile application designed to identify, report, and track road damage including potholes, litter, and other infrastructure issues using advanced AI technology.
          </Paragraph>
          <Paragraph style={styles.descText}>
            Our mission is to improve road safety and quality of life by enabling citizens to report issues in real-time and connect with authorities for faster maintenance.
          </Paragraph>
        </Card.Content>
      </Card>

      {/* Key Features */}
      <View style={styles.section}>
        <Title style={styles.sectionTitle}>✨ Key Features</Title>

        <FeatureItem
          icon="image-check"
          title="Image Detection"
          desc="Analyze photographs for road damage"
        />
        <FeatureItem
          icon="video-check"
          title="Video Analysis"
          desc="Process video files for damage detection"
        />
        <FeatureItem
          icon="check-circle"
          title="Live Detection"
          desc="Real-time detection using device camera"
        />
        <FeatureItem
          icon="map-marker-radius"
          title="Location Tracking"
          desc="GPS-based issue mapping and reporting"
        />
        <FeatureItem
          icon="star-circle"
          title="Rewards System"
          desc="Earn points for accurate contributions"
        />
      </View>

      {/* Technology */}
      <View style={styles.section}>
        <Title style={styles.sectionTitle}>🔬 Technology</Title>

        <Card style={styles.techCard}>
          <Card.Content>
            <Title>AI & Machine Learning</Title>
            <Paragraph style={styles.techDesc}>
              Powered by YOLOv8 deep learning model for accurate object detection and classification.
            </Paragraph>
          </Card.Content>
        </Card>

        <Card style={styles.techCard}>
          <Card.Content>
            <Title>Frontend</Title>
            <Paragraph style={styles.techDesc}>
              React Native with Expo for cross-platform mobile development.
            </Paragraph>
          </Card.Content>
        </Card>

        <Card style={styles.techCard}>
          <Card.Content>
            <Title>Backend</Title>
            <Paragraph style={styles.techDesc}>
              Spring Boot with MongoDB for scalable data management.
            </Paragraph>
          </Card.Content>
        </Card>

        <Card style={styles.techCard}>
          <Card.Content>
            <Title>Detection Service</Title>
            <Paragraph style={styles.techDesc}>
              FastAPI with Python for high-performance inference.
            </Paragraph>
          </Card.Content>
        </Card>
      </View>

      {/* Team */}
      <View style={styles.section}>
        <Title style={styles.sectionTitle}>👥 Team</Title>

        <TeamMember
          name="Dr. Alex Chen"
          role="Lead Developer"
          icon="code-braces"
        />
        <TeamMember
          name="Sarah Johnson"
          role="AI/ML Engineer"
          icon="brain"
        />
        <TeamMember
          name="Mike Williams"
          role="Backend Engineer"
          icon="server"
        />
        <TeamMember
          name="Emma Davis"
          role="UI/UX Designer"
          icon="palette"
        />
      </View>

      {/* Benefits */}
      <View style={styles.section}>
        <Title style={styles.sectionTitle}>🎯 Community Impact</Title>

        <BenefitItem
          icon="road"
          title="Safer Roads"
          desc="Help improve road safety in your community"
        />
        <BenefitItem
          icon="speedometer"
          title="Faster Response"
          desc="Speed up maintenance with real-time reporting"
        />
        <BenefitItem
          icon="earth"
          title="Environmental"
          desc="Support sustainable urban development"
        />
        <BenefitItem
          icon="account-multiple"
          title="Community"
          desc="Join thousands of concerned citizens"
        />
      </View>

      {/* Contact & Links */}
      <View style={styles.section}>
        <Title style={styles.sectionTitle}>📞 Get in Touch</Title>

        <View style={styles.linksContainer}>
          <LinkButton
            icon="email"
            label="Email Us"
            onPress={() => openUrl('mailto:support@roaddetection.com')}
          />
          <LinkButton
            icon="web"
            label="Website"
            onPress={() => openUrl('https://roaddetection.com')}
          />
          <LinkButton
            icon="facebook"
            label="Facebook"
            onPress={() => openUrl('https://facebook.com/roaddetection')}
          />
          <LinkButton
            icon="twitter"
            label="Twitter"
            onPress={() => openUrl('https://twitter.com/roaddetection')}
          />
        </View>
      </View>

      {/* Legal */}
      <View style={styles.section}>
        <Title style={styles.sectionTitle}>⚖️ Legal</Title>

        <Button
          mode="text"
          onPress={() => openUrl('https://roaddetection.com/privacy')}
          icon="file-document"
        >
          Privacy Policy
        </Button>
        <Button
          mode="text"
          onPress={() => openUrl('https://roaddetection.com/terms')}
          icon="file-document"
        >
          Terms of Service
        </Button>
        <Button
          mode="text"
          onPress={() => openUrl('https://roaddetection.com/open-source')}
          icon="github"
        >
          Open Source Licenses
        </Button>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Divider />
        <Paragraph style={styles.footerText}>
          Made with ❤️ for a safer community
        </Paragraph>
        <Paragraph style={styles.footerSubtext}>
          © 2024 Road Detection System. All rights reserved.
        </Paragraph>
      </View>
    </ScrollView>
  );
}

function FeatureItem({ icon, title, desc }) {
  return (
    <View style={styles.featureItem}>
      <MaterialCommunityIcons name={icon} size={32} color="#667eea" />
      <View style={styles.featureContent}>
        <Title style={styles.featureTitle}>{title}</Title>
        <Paragraph style={styles.featureDesc}>{desc}</Paragraph>
      </View>
    </View>
  );
}

function TeamMember({ name, role, icon }) {
  return (
    <Card style={styles.memberCard}>
      <Card.Content style={styles.memberContent}>
        <MaterialCommunityIcons name={icon} size={40} color="#667eea" />
        <View style={styles.memberInfo}>
          <Title style={styles.memberName}>{name}</Title>
          <Paragraph style={styles.memberRole}>{role}</Paragraph>
        </View>
      </Card.Content>
    </Card>
  );
}

function BenefitItem({ icon, title, desc }) {
  return (
    <View style={styles.benefitItem}>
      <View style={styles.benefitIcon}>
        <MaterialCommunityIcons name={icon} size={28} color="#667eea" />
      </View>
      <View style={styles.benefitContent}>
        <Title style={styles.benefitTitle}>{title}</Title>
        <Paragraph style={styles.benefitDesc}>{desc}</Paragraph>
      </View>
    </View>
  );
}

function LinkButton({ icon, label, onPress }) {
  return (
    <Button
      mode="outlined"
      onPress={onPress}
      icon={icon}
      style={styles.linkButton}
    >
      {label}
    </Button>
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
    alignItems: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  appTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 12,
  },
  version: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    marginTop: 4,
  },
  descriptionCard: {
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 16,
    elevation: 2,
  },
  divider: {
    marginVertical: 12,
  },
  descText: {
    fontSize: 13,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  section: {
    paddingHorizontal: 16,
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  featureContent: {
    flex: 1,
    marginLeft: 12,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  featureDesc: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  techCard: {
    marginBottom: 12,
    elevation: 1,
  },
  techDesc: {
    fontSize: 12,
    color: '#666',
    marginTop: 8,
  },
  memberCard: {
    marginBottom: 12,
    elevation: 1,
  },
  memberContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  memberInfo: {
    flex: 1,
    marginLeft: 12,
  },
  memberName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  memberRole: {
    fontSize: 12,
    color: '#667eea',
    marginTop: 2,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  benefitIcon: {
    marginRight: 12,
  },
  benefitContent: {
    flex: 1,
  },
  benefitTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#333',
  },
  benefitDesc: {
    fontSize: 11,
    color: '#666',
    marginTop: 2,
  },
  linksContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 12,
  },
  linkButton: {
    flex: 1,
    minWidth: '45%',
    borderColor: '#667eea',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 20,
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  footerText: {
    fontSize: 13,
    color: '#666',
    marginTop: 12,
    textAlign: 'center',
  },
  footerSubtext: {
    fontSize: 11,
    color: '#999',
    marginTop: 8,
  },
});
