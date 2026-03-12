#!/usr/bin/env python3
"""
Video processing script that applies YOLO object detection to video frames
and reconstructs the video with bounding boxes drawn on detected objects.
"""

import sys
import os
import cv2
import numpy as np
from pathlib import Path
import requests
import json
import time

# Configuration
BACKEND_URL = os.getenv('YOLO_API_URL', 'http://localhost:8087/detect')
TEMP_DIR = os.getenv('VIDEO_TEMP_DIR', './model/videos')

def create_temp_dir():
    """Create temporary directory for frame storage"""
    os.makedirs(TEMP_DIR, exist_ok=True)

def send_frame_to_yolo(frame_path):
    """
    Send frame to YOLO API for detection
    Returns: List of detections with bounding box coordinates
    """
    try:
        with open(frame_path, 'rb') as f:
            files = {'file': f}
            response = requests.post(BACKEND_URL, files=files, timeout=60)
            
        if response.status_code == 200:
            result = response.json()
            return result.get('detections', [])
        else:
            print(f"YOLO API error: {response.status_code}")
            return []
    except requests.exceptions.RequestException as e:
        print(f"Error sending frame to YOLO: {e}")
        return []

def draw_bounding_boxes(frame, detections):
    """
    Draw bounding boxes on frame
    
    Args:
        frame: OpenCV frame
        detections: List of detection dictionaries with coordinates
    
    Returns:
        Frame with drawn bounding boxes
    """
    frame_copy = frame.copy()
    
    for detection in detections:
        try:
            # Extract coordinates based on detection format
            if 'box' in detection:
                x1, y1, x2, y2 = detection['box']
            elif 'x1' in detection:
                x1, y1, x2, y2 = detection['x1'], detection['y1'], detection['x2'], detection['y2']
            else:
                continue
            
            # Convert to integers if needed
            x1, y1, x2, y2 = int(x1), int(y1), int(x2), int(y2)
            
            # Draw rectangle (red color)
            cv2.rectangle(frame_copy, (x1, y1), (x2, y2), (0, 0, 255), 2)
            
            # Add label if available
            label = detection.get('class_name', 'Object')
            confidence = detection.get('confidence', 0)
            
            if confidence > 0:
                text = f"{label}: {confidence:.2f}"
            else:
                text = label
            
            # Put text with background
            font = cv2.FONT_HERSHEY_SIMPLEX
            font_scale = 0.5
            thickness = 1
            text_color = (255, 255, 255)  # White
            bg_color = (0, 0, 255)  # Red
            
            (text_width, text_height) = cv2.getTextSize(text, font, font_scale, thickness)[0]
            
            # Draw background rectangle for text
            cv2.rectangle(frame_copy, 
                         (x1, y1 - text_height - 10),
                         (x1 + text_width, y1),
                         bg_color, -1)
            
            # Put text
            cv2.putText(frame_copy, text, (x1, y1 - 5), font, font_scale, text_color, thickness)
            
        except Exception as e:
            print(f"Error drawing detection: {e}")
            continue
    
    return frame_copy

def process_video(input_path, output_path):
    """
    Process video file with YOLO detection
    
    Args:
        input_path: Path to input video
        output_path: Path to save processed video
    """
    print(f"Starting video processing: {input_path}")
    
    # Open video
    cap = cv2.VideoCapture(input_path)
    
    if not cap.isOpened():
        raise ValueError(f"Cannot open video: {input_path}")
    
    # Get video properties
    input_fps = cap.get(cv2.CAP_PROP_FPS)
    original_width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    original_height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    
    # Set output FPS to 30
    OUTPUT_FPS = 30
    fps = OUTPUT_FPS
    
    # Resize to 480p while maintaining aspect ratio
    TARGET_HEIGHT = 480
    aspect_ratio = original_width / original_height
    width = int(TARGET_HEIGHT * aspect_ratio)
    height = TARGET_HEIGHT
    
    # Make dimensions even (required for some codecs)
    width = width if width % 2 == 0 else width - 1
    height = height if height % 2 == 0 else height - 1
    
    print(f"Video properties: {original_width}x{original_height} -> {width}x{height}, input FPS: {input_fps}, output FPS: {fps}, total frames: {total_frames}")
    
    # Create video writer with 30fps output at 480p resolution
    fourcc = cv2.VideoWriter_fourcc(*'mp4v')  # Use MP4 codec
    out = cv2.VideoWriter(output_path, fourcc, fps, (width, height))
    
    if not out.isOpened():
        raise ValueError(f"Cannot create output video: {output_path}")
    
    frame_count = 0
    detection_count = 0
    processed_count = 0
    
    # AGGRESSIVE frame skipping for speed: process 1 out of 15 frames = 15x faster!
    # Increase FRAME_SKIP for even faster processing
    # FRAME_SKIP values: 5 (5x faster), 10 (10x faster), 15 (15x faster)
    FRAME_SKIP = 15
    internal_frame_count = 0
    
    create_temp_dir()
    
    try:
        while True:
            ret, frame = cap.read()
            if not ret:
                break
            
            internal_frame_count += 1
            
            # Skip frames for faster processing
            if internal_frame_count % FRAME_SKIP != 0:
                # Copy frame without detection for skipped frames
                frame = cv2.resize(frame, (width, height), interpolation=cv2.INTER_LANCZOS4)
                out.write(frame)
                continue
            
            frame_count += 1
            print(f"Processing frame {frame_count}/{total_frames // FRAME_SKIP} (actual: {internal_frame_count}/{total_frames})")
            
            # Resize frame to 480p
            frame = cv2.resize(frame, (width, height), interpolation=cv2.INTER_LANCZOS4)
            
            # Save frame temporarily
            temp_frame_path = os.path.join(TEMP_DIR, f'temp_frame_{frame_count}.jpg')
            cv2.imwrite(temp_frame_path, frame)
            
            # Send to YOLO for detection
            detections = send_frame_to_yolo(temp_frame_path)
            detection_count += len(detections)
            
            # Draw bounding boxes
            if detections:
                frame = draw_bounding_boxes(frame, detections)
                processed_count += 1
            
            # Write frame to output video
            out.write(frame)
            
            # Clean up temp file
            try:
                os.remove(temp_frame_path)
            except:
                pass
            
            # Progress update every 10 frames
            if frame_count % 10 == 0:
                print(f"Progress: {frame_count}/{total_frames} frames processed")
    
    finally:
        cap.release()
        out.release()
    
    print(f"Video processing complete!")
    print(f"Total frames: {frame_count}")
    print(f"Frames with detections: {processed_count}")
    print(f"Total detections: {detection_count}")
    print(f"Output file: {output_path}")
    
    if not os.path.exists(output_path):
        raise ValueError("Output video file was not created")

def main():
    if len(sys.argv) != 3:
        print("Usage: python process_video.py <input_video> <output_video>")
        sys.exit(1)
    
    input_path = sys.argv[1]
    output_path = sys.argv[2]
    
    if not os.path.exists(input_path):
        print(f"Error: Input file not found: {input_path}")
        sys.exit(1)
    
    try:
        process_video(input_path, output_path)
        print("Success")
        sys.exit(0)
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

if __name__ == '__main__':
    main()
