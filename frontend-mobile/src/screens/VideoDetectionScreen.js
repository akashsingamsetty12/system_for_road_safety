import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Alert, Image } from 'react-native';
import { Button, Card, Title, Paragraph, ActivityIndicator } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import * as ImagePicker from 'expo-image-picker';
import * as VideoThumbnails from 'expo-video-thumbnails';
import { Video } from 'expo-av';
import { API_BASE_URL } from '../services/api';
import { getCurrentLocation } from '../services/locationService';
import { lightTheme, spacing, typography, borderRadius } from '../config/theme';

// Database saving disabled for faster response time
// Results are displayed locally only

export default function VideoDetectionScreen() {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [processedFrames, setProcessedFrames] = useState([]);
  const [error, setError] = useState(null);

  const pickVideoFromGallery = async () => {
    try {
      let pickerResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: false,
        quality: 0.8,
      });

      if (!pickerResult.canceled) {
        setSelectedVideo(pickerResult.assets[0]);
        setResult(null);
      }
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  };

  const recordVideo = async () => {
    try {
      let pickerResult = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: false,
        quality: 0.8,
      });

      if (!pickerResult.canceled) {
        setSelectedVideo(pickerResult.assets[0]);
        setResult(null);
      }
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  };

  const handleProcessVideo = async () => {
    if (!selectedVideo) {
      Alert.alert('Error', 'Please select a video');
      return;
    }

    setIsLoading(true);
    setError(null);
    setProcessedFrames([]);

    try {
      const formData = new FormData();
      
      formData.append('file', {
        uri: selectedVideo.uri,
        type: 'video/mp4',
        name: selectedVideo.filename || 'video.mp4',
      });

      console.log('Video details:', {
        uri: selectedVideo.uri,
        filename: selectedVideo.filename,
      });
      console.log(`Sending video for detection...`);

      const response = await fetch(`${API_BASE_URL}/potholes/detect-video`, {
        method: 'POST',
        body: formData,
        timeout: 3600000, // 1 hour timeout for video processing
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Backend error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Backend response:', data);

      if (!data.success) {
        throw new Error(data.message || 'Video processing failed');
      }

      // Construct full video URL using API_BASE_URL
      let videoUrl = data.videoUrl || data.videoPath;
      if (videoUrl && !videoUrl.startsWith('http')) {
        videoUrl = `${API_BASE_URL}${videoUrl}`;
      }
      
      console.log('Using video URL:', videoUrl);
      
      setResult({
        framesAnalyzed: 'Full Video',
        framesProcessed: 'All Frames',
        duration: selectedVideo.duration ? `${(selectedVideo.duration / 1000).toFixed(2)}s` : 'Unknown',
        totalObjects: 'Processing Complete',
        videoUrl: videoUrl,  // Store as videoUrl to match the video player check
        videoPath: videoUrl, // Keep for backward compatibility
      });

      // Store one frame as thumbnail for display
      setProcessedFrames([{
        id: 0,
        time: 'Full Video',
        videoPath: videoUrl,
        count: '✓',
        detections: [],
      }]);

      setIsLoading(false);
      
      Alert.alert('Success', 'Video processing complete!');

    } catch (err) {
      const errMsg = err.message || 'Video processing failed';
      setError(errMsg);
      setIsLoading(false);
      Alert.alert('Error', 'Video processing failed: ' + errMsg);
      console.error('Video processing error:', err);
    }
  };

  const handleReset = () => {
    setSelectedVideo(null);
    setResult(null);
  };

  return (
    <ScrollView style={styles.container}>
      {/* Hero Header */}
      <View style={styles.heroHeader}>
        <View style={styles.heroContent}>
          <MaterialCommunityIcons name="video" size={48} color={lightTheme.primary} />
          <Title style={styles.heroTitle}>Video Detection</Title>
          <Paragraph style={styles.heroSubtitle}>Record or upload videos to detect road damage</Paragraph>
        </View>
      </View>

      {/* Video Preview */}
      <Card style={styles.videoCard}>
        {selectedVideo ? (
          <>
            <Video
              source={{ uri: selectedVideo.uri }}
              rate={1.0}
              volume={1.0}
              isMuted={false}
              resizeMode="contain"
              useNativeControls
              style={styles.videoPlayer}
            />
            <Card.Content>
              <Paragraph style={styles.videoName}>
                {selectedVideo.filename || selectedVideo.uri.split('/').pop()}
              </Paragraph>
              <Paragraph style={styles.videoInfo}>
                Duration: {selectedVideo.duration ? `${(selectedVideo.duration / 1000).toFixed(1)}s` : 'Unknown'}
              </Paragraph>
            </Card.Content>
          </>
        ) : (
          <View style={styles.videoPlaceholder}>
            <Title style={styles.placeholderTitle}>Ready to Process</Title>
            <Paragraph style={styles.placeholderText}>
              Select a video from your camera or gallery to analyze for road damage
            </Paragraph>
            <View style={styles.placeholderDots}>
              <View style={styles.dot} />
              <View style={styles.dot} />
              <View style={styles.dot} />
            </View>
          </View>
        )}
      </Card>

      {/* Action Buttons */}
      <View style={styles.actionButtonsContainer}>
        <Button
          mode="outlined"
          onPress={recordVideo}
          icon="plus-circle"
          style={styles.flexButton}
          labelStyle={styles.buttonLabel}
        >
          Record Video
        </Button>
        <Button
          mode="outlined"
          onPress={pickVideoFromGallery}
          icon="folder-multiple"
          style={styles.flexButton}
          labelStyle={styles.buttonLabel}
        >
          Gallery
        </Button>
      </View>

      {/* Process Button with Helper */}
      {selectedVideo && !isLoading && (
        <>
          <Button
            mode="contained"
            onPress={handleProcessVideo}
            icon="play-circle"
            style={styles.processButton}
            buttonColor={lightTheme.success}
            labelStyle={styles.buttonLabel}
          >
            Analyze Video
          </Button>
          <Paragraph style={styles.analyzeHint}>AI will process and detect road damage in all frames</Paragraph>
        </>
      )}

      {/* Loading */}
      {isLoading && (
        <Card style={styles.loadingCard}>
          <Card.Content style={styles.loadingContent}>
            <MaterialCommunityIcons name="video-outline" size={48} color={lightTheme.primary} />
            <Title style={styles.loadingTitle}>Processing Video</Title>
            <Paragraph style={styles.loadingSubtitle}>Analyzing all frames for road damage...</Paragraph>
            <ActivityIndicator animating={true} size="large" color={lightTheme.primary} style={styles.loadingSpinner} />
          </Card.Content>
        </Card>
      )}

      {/* Results */}
      {result && !isLoading && (
        <>
          {error && (
            <Card style={styles.errorCard}>
              <Card.Content style={styles.errorContent}>
                <MaterialCommunityIcons name="alert-circle" size={24} color={lightTheme.danger} />
                <Paragraph style={styles.errorText}>{error}</Paragraph>
              </Card.Content>
            </Card>
          )}

          {/* Results Header */}
          <View style={styles.resultsHeader}>
            <MaterialCommunityIcons name="check-circle" size={32} color={lightTheme.success} />
            <View style={styles.resultsHeaderContent}>
              <Title style={styles.resultsTitle}>Detection Complete</Title>
              <Paragraph style={styles.resultsSubtitle}>Full video analyzed successfully</Paragraph>
            </View>
          </View>

          {/* Summary Cards */}
          <View style={styles.summaryCards}>
            <View style={styles.summaryCard}>
              <View style={[styles.summaryIconContainer, { backgroundColor: `${lightTheme.primary}15` }]}>
                <MaterialCommunityIcons name="play" size={24} color={lightTheme.primary} />
              </View>
              <Paragraph style={styles.summaryLabel}>Duration</Paragraph>
              <Title style={styles.summaryValue}>{result.duration}</Title>
            </View>
            <View style={styles.summaryCard}>
              <View style={[styles.summaryIconContainer, { backgroundColor: `${lightTheme.info}15` }]}>
                <MaterialCommunityIcons name="video" size={24} color={lightTheme.info} />
              </View>
              <Paragraph style={styles.summaryLabel}>Frames</Paragraph>
              <Title style={styles.summaryValue}>{result.framesAnalyzed}</Title>
            </View>
            <View style={styles.summaryCard}>
              <View style={[styles.summaryIconContainer, { backgroundColor: `${lightTheme.success}15` }]}>
                <MaterialCommunityIcons name="check" size={24} color={lightTheme.success} />
              </View>
              <Paragraph style={styles.summaryLabel}>Status</Paragraph>
              <Title style={styles.summaryValue}>Done</Title>
            </View>
          </View>

          {/* Processed Video */}
          {result?.videoUrl && (
            <View style={styles.processedVideoSection}>
              <Video
                source={{ uri: result.videoUrl }}
                rate={1.0}
                volume={1.0}
                isMuted={false}
                resizeMode="contain"
                useNativeControls
                style={styles.processedVideoPlayer}
              />
              <View style={styles.successBadge}>
                <MaterialCommunityIcons name="check-circle" size={20} color={lightTheme.success} />
                <Paragraph style={styles.successText}>Ready for Review</Paragraph>
              </View>
            </View>
          )}

          <Button
            mode="outlined"
            onPress={handleReset}
            icon="refresh"
            style={[styles.resetButton, { borderColor: lightTheme.danger }]}
            labelStyle={{ color: lightTheme.danger }}
          >
            Reset
          </Button>
        </>
      )}

      {/* Requirements Banner */}
      <View style={styles.requirementsContainer}>
        <View style={styles.requirementChip}>
          <MaterialCommunityIcons name="film" size={14} color={lightTheme.primary} />
          <Paragraph style={styles.chipText}>MP4, MOV</Paragraph>
        </View>
        <View style={styles.requirementChip}>
          <MaterialCommunityIcons name="database" size={14} color={lightTheme.warning} />
          <Paragraph style={styles.chipText}>≤500MB</Paragraph>
        </View>
        <View style={styles.requirementChip}>
          <MaterialCommunityIcons name="television" size={14} color={lightTheme.success} />
          <Paragraph style={styles.chipText}>720p+</Paragraph>
        </View>
        <View style={styles.requirementChip}>
          <MaterialCommunityIcons name="clock-fast" size={14} color={lightTheme.info} />
          <Paragraph style={styles.chipText}>Fast</Paragraph>
        </View>
      </View>
    </ScrollView>
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
  videoCard: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    borderRadius: borderRadius.lg,
    elevation: 3,
    overflow: 'hidden',
    backgroundColor: lightTheme.surface,
  },
  videoPlayer: {
    width: '100%',
    height: 300,
    backgroundColor: '#000',
  },
  videoPlaceholder: {
    width: '100%',
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    backgroundColor: `${lightTheme.border}10`,
  },
  placeholderTitle: {
    fontSize: typography.h4.fontSize,
    fontWeight: '700',
    color: lightTheme.text.primary,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  placeholderText: {
    fontSize: typography.body.fontSize,
    color: lightTheme.text.secondary,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  placeholderDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: lightTheme.border,
  },
  videoName: {
    fontSize: typography.body.fontSize,
    fontWeight: '600',
    color: lightTheme.text.primary,
  },
  videoInfo: {
    fontSize: typography.small.fontSize,
    color: lightTheme.text.secondary,
    marginTop: spacing.md,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.lg,
    gap: spacing.md,
  },
  flexButton: {
    flex: 1,
    paddingVertical: spacing.lg,
    borderRadius: borderRadius.md,
    borderWidth: 1.5,
  },
  buttonLabel: {
    fontSize: typography.body.fontSize,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  processButton: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.sm,
    paddingVertical: spacing.lg,
    borderRadius: borderRadius.md,
  },
  analyzeHint: {
    fontSize: typography.small.fontSize,
    color: lightTheme.text.secondary,
    textAlign: 'center',
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    fontStyle: 'italic',
  },
  loadingCard: {
    marginHorizontal: spacing.lg,
    marginVertical: spacing.xl,
    borderRadius: borderRadius.lg,
    elevation: 3,
    backgroundColor: lightTheme.surface,
  },
  loadingContent: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
  },
  loadingTitle: {
    fontSize: typography.h5.fontSize,
    fontWeight: '700',
    color: lightTheme.text.primary,
    marginTop: spacing.lg,
  },
  loadingSubtitle: {
    fontSize: typography.small.fontSize,
    color: lightTheme.text.secondary,
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  loadingSpinner: {
    marginTop: spacing.lg,
  },
  // Results Header
  resultsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    backgroundColor: `${lightTheme.success}12`,
    borderLeftWidth: 5,
    borderLeftColor: lightTheme.success,
    borderRadius: borderRadius.lg,
  },
  resultsHeaderContent: {
    flex: 1,
    marginLeft: spacing.md,
  },
  resultsTitle: {
    fontSize: typography.h6.fontSize,
    fontWeight: '700',
    color: lightTheme.success,
    marginBottom: spacing.xs,
  },
  resultsSubtitle: {
    fontSize: typography.small.fontSize,
    color: lightTheme.success,
  },
  // Summary Cards
  summaryCards: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    gap: spacing.md,
  },
  summaryCard: {
    flex: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.lg,
    borderRadius: borderRadius.lg,
    backgroundColor: lightTheme.surface,
    elevation: 3,
    alignItems: 'center',
  },
  summaryIconContainer: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  summaryLabel: {
    fontSize: typography.small.fontSize,
    fontWeight: '500',
    color: lightTheme.text.secondary,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  summaryValue: {
    fontSize: typography.h5.fontSize,
    fontWeight: '700',
    color: lightTheme.text.primary,
    textAlign: 'center',
  },

  resetButton: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.xxl,
    paddingVertical: spacing.md,
    borderWidth: 1.5,
  },
  // Requirements Container
  requirementsContainer: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.xxl,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    justifyContent: 'flex-start',
  },
  requirementChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.xl,
    backgroundColor: lightTheme.surface,
    elevation: 2,
    gap: spacing.xs,
    borderWidth: 1,
    borderColor: `${lightTheme.border}20`,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
    color: lightTheme.text.primary,
  },
  // Processed Video Section
  processedVideoSection: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    backgroundColor: '#000',
    elevation: 3,
  },
  processedVideoPlayer: {
    width: '100%',
    height: 300,
    backgroundColor: '#000',
  },
  successBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${lightTheme.success}15`,
    borderColor: lightTheme.success,
    borderWidth: 1,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    marginTop: spacing.md,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    gap: spacing.md,
  },
  successText: {
    fontSize: typography.small.fontSize,
    color: lightTheme.success,
    fontWeight: '600',
    flex: 1,
  },
  errorCard: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    backgroundColor: `${lightTheme.danger}15`,
    borderRadius: borderRadius.lg,
    borderLeftWidth: 4,
    borderLeftColor: lightTheme.danger,
  },
  errorContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  errorText: {
    color: lightTheme.danger,
    fontSize: typography.small.fontSize,
    fontWeight: '600',
    marginLeft: spacing.md,
    flex: 1,
  },
  infoMessageCard: {
    marginHorizontal: 16,
    marginBottom: 12,
    backgroundColor: '#dbeafe',
  },
  infoMessageText: {
    color: '#1e40af',
    fontSize: 12,
    lineHeight: 18,
  },
  noteCard: {
    marginHorizontal: 16,
    marginBottom: 12,
    elevation: 2,
    backgroundColor: '#f0fdf4',
  },
  noteTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#15803d',
    marginBottom: 8,
  },
  noteText: {
    fontSize: 11,
    color: '#166534',
    lineHeight: 18,
  },
  framesCard: {
    marginHorizontal: 16,
    marginBottom: 12,
    elevation: 2,
  },
  framesDesc: {
    fontSize: 12,
    color: '#666',
    marginBottom: 12,
  },
  framesListContainer: {
    gap: 12,
  },
  frameContainerWrapper: {
    position: 'relative',
  },
  frameIndexBadge: {
    position: 'absolute',
    top: -8,
    left: 12,
    backgroundColor: '#2563eb',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  frameIndexText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
  },
  frameWrapper: {
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  frameImage: {
    width: '100%',
    height: 180,
    backgroundColor: '#000',
  },
  frameInfoBar: {
    padding: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  frameTime: {
    fontSize: 11,
    color: '#666',
    fontWeight: '500',
  },
  frameCount: {
    fontSize: 11,
    color: '#2563eb',
    fontWeight: 'bold',
  },
  frameContainer: {
    marginVertical: 8,
  },
  frameInfo: {
    padding: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  noFramePlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f5',
  },
  noFrameText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 12,
    paddingHorizontal: 16,
  },
  emptyFramesCard: {
    marginHorizontal: 16,
    marginBottom: 12,
    elevation: 2,
    backgroundColor: '#dbeafe',
  },
  emptyFramesText: {
    color: '#1e40af',
    fontSize: 13,
  },
  processedVideoContainer: {
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#000',
    elevation: 3,
  },
  processedVideoPlayer: {
    width: '100%',
    height: 300,
    backgroundColor: '#000',
  },
  videoPathText: {
    padding: 12,
    backgroundColor: '#f0fdf4',
    color: '#15803d',
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '600',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 8,
  },
  statItem: {
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  statusNote: {
    fontSize: 11,
    color: '#666',
    marginTop: 12,
    fontStyle: 'italic',
  },
  detectionInfoCard: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    borderRadius: borderRadius.lg,
    elevation: 3,
    backgroundColor: lightTheme.surface,
  },
  detectionInfoTitle: {
    fontSize: typography.h6.fontSize,
    fontWeight: '700',
    color: lightTheme.text.primary,
    marginBottom: spacing.lg,
  },
  // Processed Video Section
  processedVideoSection: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    backgroundColor: '#000',
    elevation: 3,
  },
  processedVideoPlayer: {
    width: '100%',
    height: 300,
    backgroundColor: '#000',
  },
  successBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${lightTheme.success}15`,
    borderColor: lightTheme.success,
    borderWidth: 1,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    marginTop: spacing.md,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    gap: spacing.md,
  },
  successText: {
    fontSize: typography.small.fontSize,
    color: lightTheme.success,
    fontWeight: '600',
    flex: 1,
  },

});
