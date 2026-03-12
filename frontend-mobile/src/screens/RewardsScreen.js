import React, { useState } from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import { Card, Title, Paragraph, Button, Chip, ProgressBar } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default function RewardsScreen({ navigation }) {
  const [userStats] = useState({
    totalReports: 24,
    acceptedReports: 22,
    accuracy: 0.92,
    points: 2450,
    level: 'Silver',
    nextLevel: 'Gold',
    pointsToNextLevel: 550,
  });

  const rewards = [
    {
      id: 1,
      name: 'Verified Contributor',
      description: '5+报告',
      points: 100,
      unlocked: true,
      icon: 'medal',
    },
    {
      id: 2,
      name: 'Road Guardian',
      description: '20+ accurate reports',
      points: 250,
      unlocked: true,
      icon: 'shield-check',
    },
    {
      id: 3,
      name: 'Detection Master',
      description: '100+ reports',
      points: 1000,
      unlocked: false,
      icon: 'star',
    },
    {
      id: 4,
      name: 'Community Leader',
      description: 'Nominated by admin',
      points: 2000,
      unlocked: false,
      icon: 'crown',
    },
  ];

  const leaderboard = [
    { rank: 1, name: 'Alex Chen', points: 5680, reports: 156 },
    { rank: 2, name: 'Sarah Johnson', points: 4920, reports: 138 },
    { rank: 3, name: 'Mike Williams', points: 4120, reports: 98 },
    { rank: 4, name: 'Emma Davis', points: 3450, reports: 76 },
    { rank: 5, name: 'You (John)', points: userStats.points, reports: userStats.totalReports },
  ];

  return (
    <ScrollView style={styles.container}>
      {/* User Stats Header */}
      <View style={styles.header}>
        <View style={styles.userSection}>
          <View style={styles.avatar}>
            <MaterialCommunityIcons name="account-circle" size={60} color="#667eea" />
          </View>
          <View style={styles.userInfo}>
            <Title style={styles.userName}>John Doe</Title>
            <Paragraph style={styles.userLevel}>
              🏆 {userStats.level} Level
            </Paragraph>
          </View>
        </View>

        <View style={styles.statsGrid}>
          <StatBox label="Reports" value={userStats.totalReports} icon="check-circle" />
          <StatBox label="Accuracy" value={`${(userStats.accuracy * 100).toFixed(0)}%`} icon="bullseye" />
          <StatBox label="Points" value={userStats.points} icon="star" />
        </View>
      </View>

      {/* Level Progress */}
      <Card style={styles.progressCard}>
        <Card.Content>
          <Title>Progress to {userStats.nextLevel}</Title>
          <ProgressBar
            progress={1 - (userStats.pointsToNextLevel / 1000)}
            style={styles.progressBar}
            color="#667eea"
          />
          <Paragraph style={styles.progressText}>
            {userStats.points} / {userStats.points + userStats.pointsToNextLevel} points
          </Paragraph>
        </Card.Content>
      </Card>

      {/* Achievements */}
      <View style={styles.section}>
        <Title style={styles.sectionTitle}>🏅 Your Achievements</Title>

        <View style={styles.achievementsGrid}>
          {rewards.map((reward) => (
            <Card
              key={reward.id}
              style={[
                styles.achievementCard,
                !reward.unlocked && styles.lockedCard,
              ]}
            >
              <Card.Content style={styles.achievementContent}>
                <View style={styles.achievementIcon}>
                  <MaterialCommunityIcons
                    name={reward.icon}
                    size={40}
                    color={reward.unlocked ? '#667eea' : '#ccc'}
                  />
                </View>
                <Title style={[styles.achievementTitle, !reward.unlocked && styles.lockedText]}>
                  {reward.name}
                </Title>
                <Paragraph style={[styles.achievementDesc, !reward.unlocked && styles.lockedText]}>
                  {reward.description}
                </Paragraph>
                <Chip
                  icon="star"
                  style={styles.pointsChip}
                  textStyle={styles.pointsText}
                >
                  {reward.points}
                </Chip>
                {!reward.unlocked && (
                  <MaterialCommunityIcons
                    name="lock"
                    size={24}
                    color="#ccc"
                    style={styles.lockIcon}
                  />
                )}
              </Card.Content>
            </Card>
          ))}
        </View>
      </View>

      {/* Leaderboard */}
      <View style={styles.section}>
        <View style={styles.leaderboardHeader}>
          <Title style={styles.sectionTitle}>🏆 Leaderboard (Top 5)</Title>
          <Button mode="text" onPress={() => {}}>
            View All
          </Button>
        </View>

        {leaderboard.map((user, index) => (
          <Card key={index} style={styles.leaderboardCard}>
            <Card.Content style={styles.leaderboardContent}>
              <View style={styles.rankSection}>
                <View style={getRankBadgeStyle(user.rank)}>
                  <Paragraph style={styles.rankText}>{user.rank}</Paragraph>
                </View>
              </View>
              <View style={styles.nameSection}>
                <Title style={styles.leaderboardName}>{user.name}</Title>
                <Paragraph style={styles.leaderboardReports}>
                  {user.reports} reports
                </Paragraph>
              </View>
              <View style={styles.pointsSection}>
                <Title style={styles.leaderboardPoints}>{user.points}</Title>
                <Paragraph style={styles.pointsLabel}>pts</Paragraph>
              </View>
            </Card.Content>
          </Card>
        ))}
      </View>

      {/* Rewards Info */}
      <Card style={styles.infoCard}>
        <Card.Title title="ℹ️ How Rewards Work" />
        <Card.Content>
          <Paragraph style={styles.infoText}>
            • Earn points for each valid report{'\n'}
            • Bonus points for high accuracy{'\n'}
            • Unlock badges and achievements{'\n'}
            • Reach leaderboard rankings
          </Paragraph>
        </Card.Content>
      </Card>

      {/* Rewards Store Preview */}
      <View style={styles.section}>
        <Title style={styles.sectionTitle}>🎁 Rewards Store</Title>

        <Card style={styles.storeCard}>
          <Card.Content>
            <View style={styles.storeItem}>
              <MaterialCommunityIcons name="coffee" size={32} color="#667eea" />
              <View style={styles.storeItemInfo}>
                <Title style={styles.storeItemTitle}>Coffee Voucher</Title>
                <Paragraph style={styles.storeItemDesc}>Redeem for local café</Paragraph>
              </View>
              <Paragraph style={styles.storeCost}>500 pts</Paragraph>
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.storeCard}>
          <Card.Content>
            <View style={styles.storeItem}>
              <MaterialCommunityIcons name="pizza" size={32} color="#667eea" />
              <View style={styles.storeItemInfo}>
                <Title style={styles.storeItemTitle}>Pizza Discount</Title>
                <Paragraph style={styles.storeItemDesc}>20% off at partner restaurants</Paragraph>
              </View>
              <Paragraph style={styles.storeCost}>750 pts</Paragraph>
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.storeCard}>
          <Card.Content>
            <View style={styles.storeItem}>
              <MaterialCommunityIcons name="gas-cylinder" size={32} color="#667eea" />
              <View style={styles.storeItemInfo}>
                <Title style={styles.storeItemTitle}>Fuel Voucher</Title>
                <Paragraph style={styles.storeItemDesc}>₹500 fuel credit</Paragraph>
              </View>
              <Paragraph style={styles.storeCost}>1500 pts</Paragraph>
            </View>
          </Card.Content>
        </Card>

        <Button
          mode="contained"
          style={styles.storeButton}
          onPress={() => {}}
        >
          Browse All Rewards
        </Button>
      </View>
    </ScrollView>
  );
}

function StatBox({ label, value, icon }) {
  return (
    <View style={styles.statBox}>
      <MaterialCommunityIcons name={icon} size={24} color="#667eea" />
      <Title style={styles.statValue}>{value}</Title>
      <Paragraph style={styles.statLabel}>{label}</Paragraph>
    </View>
  );
}

function getRankBadgeStyle(rank) {
  const baseStyle = {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  };

  switch (rank) {
    case 1:
      return { ...baseStyle, backgroundColor: '#fbbf24' };
    case 2:
      return { ...baseStyle, backgroundColor: '#d1d5db' };
    case 3:
      return { ...baseStyle, backgroundColor: '#d4841a' };
    default:
      return { ...baseStyle, backgroundColor: '#e5e7eb' };
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#667eea',
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 24,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    marginRight: 16,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  userLevel: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 12,
    marginTop: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  statBox: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  statValue: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 4,
  },
  statLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 11,
    marginTop: 2,
  },
  progressCard: {
    marginHorizontal: 16,
    marginTop: -12,
    marginBottom: 16,
    elevation: 4,
  },
  progressBar: {
    height: 8,
    marginVertical: 12,
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
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
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  achievementCard: {
    width: '48%',
    marginBottom: 12,
    elevation: 2,
  },
  lockedCard: {
    opacity: 0.6,
  },
  achievementContent: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  achievementIcon: {
    marginBottom: 8,
  },
  achievementTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  achievementDesc: {
    fontSize: 11,
    color: '#666',
    textAlign: 'center',
    marginBottom: 8,
  },
  lockedText: {
    color: '#999',
  },
  pointsChip: {
    marginTop: 4,
  },
  pointsText: {
    fontSize: 11,
  },
  lockIcon: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  leaderboardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  leaderboardCard: {
    marginBottom: 8,
    elevation: 1,
  },
  leaderboardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rankSection: {
    marginRight: 4,
  },
  rankText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'center',
  },
  nameSection: {
    flex: 1,
  },
  leaderboardName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  leaderboardReports: {
    fontSize: 11,
    color: '#999',
    marginTop: 2,
  },
  pointsSection: {
    alignItems: 'flex-end',
  },
  leaderboardPoints: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#667eea',
  },
  pointsLabel: {
    fontSize: 10,
    color: '#999',
  },
  infoCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    elevation: 2,
  },
  infoText: {
    fontSize: 12,
    color: '#666',
    lineHeight: 20,
  },
  storeCard: {
    marginBottom: 12,
    elevation: 2,
  },
  storeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  storeItemInfo: {
    flex: 1,
  },
  storeItemTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  storeItemDesc: {
    fontSize: 11,
    color: '#666',
    marginTop: 2,
  },
  storeCost: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#667eea',
  },
  storeButton: {
    marginTop: 12,
    marginBottom: 20,
    paddingVertical: 6,
  },
});
