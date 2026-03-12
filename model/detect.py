from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
import cv2
import numpy as np
import base64
import json
import os
import logging
import time

# Setup logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

app = FastAPI()

# Get the directory where this script is located
script_dir = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(script_dir, "water_detection.tflite")

logger.info(f"Loading model from: {model_path}")
logger.info(f"Model exists: {os.path.exists(model_path)}")

# Load TFLite model using OpenCV DNN module (Python 3.13 compatible)
try:
    net = cv2.dnn.readNetFromTensorflow(model_path)
    logger.info(f"✓ TFLite Model loaded via OpenCV DNN!")
    USE_OPENCV_DNN = True
except Exception as e:
    logger.warning(f"Could not load with cv2.dnn: {str(e)}")
    logger.info("Using mock detection mode for testing")
    USE_OPENCV_DNN = False
    net = None

@app.post("/detect")
async def detect(file: UploadFile = File(...)):
    try:
        start_time = time.time()
        logger.info(f"📸 Received image: {file.filename}")
        
        contents = await file.read()
        logger.info(f"   File size: {len(contents)} bytes")
        
        nparr = np.frombuffer(contents, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if img is None:
            logger.error("   ❌ Error: Could not decode image")
            return {"error": "Invalid image format", "detections": []}
        
        height, width = img.shape[:2]
        logger.info(f"   Image dimensions: {width}x{height}")

        detections = []
        img_with_boxes = img.copy()
        
        # Run detection
        if USE_OPENCV_DNN and net is not None:
            logger.info("   🔍 Running TFLite Detection with OpenCV DNN...")
            try:
                # Prepare blob for OpenCV DNN
                blob = cv2.dnn.blobFromImage(img, 1.0, (416, 416), [0, 0, 0], crop=False, ddepth=cv2.CV_32F)
                net.setInput(blob)
                
                # Get output layer names
                output_layers = net.getUnconnectedOutLayersNames()
                outputs = net.forward(output_layers)
                
                class_names = ['water', 'object']
                confidence_threshold = 0.5
                nms_threshold = 0.4
                boxes = []
                confidences = []
                class_ids = []
                
                # Parse detections
                for detection_set in outputs:
                    for detection in detection_set:
                        scores = detection[5:]
                        class_id = np.argmax(scores)
                        confidence = scores[class_id]
                        
                        if confidence > confidence_threshold:
                            cx = int(detection[0] * width)
                            cy = int(detection[1] * height)
                            w = int(detection[2] * width)
                            h = int(detection[3] * height)
                            x1 = max(0, cx - w // 2)
                            y1 = max(0, cy - h // 2)
                            x2 = min(width, cx + w // 2)
                            y2 = min(height, cy + h // 2)
                            
                            boxes.append([x1, y1, x2 - x1, y2 - y1])
                            confidences.append(float(confidence))
                            class_ids.append(class_id)
                
                # Apply NMS (Non-Maximum Suppression)
                if len(boxes) > 0:
                    indices = cv2.dnn.NMSBoxes(boxes, confidences, confidence_threshold, nms_threshold)
                    
                    logger.info(f"   Found {len(indices)} detections after NMS")
                    
                    for i in indices:
                        i = i[0] if isinstance(i, np.ndarray) else i
                        x1, y1, w, h = boxes[i]
                        x2 = x1 + w
                        y2 = y1 + h
                        confidence = confidences[i]
                        class_id = class_ids[i]
                        class_name = class_names[min(class_id, len(class_names) - 1)]
                        
                        detections.append({
                            "x1": round(float(x1), 2),
                            "y1": round(float(y1), 2),
                            "x2": round(float(x2), 2),
                            "y2": round(float(y2), 2),
                            "confidence": round(confidence, 4),
                            "class": class_name,
                            "class_id": int(class_id)
                        })
                        
                        logger.info(f"     ✓ {class_name}: {confidence:.1%}")
                        
                        # Draw bounding box
                        cv2.rectangle(img_with_boxes, (int(x1), int(y1)), (int(x2), int(y2)), (0, 0, 255), 2)
                        cv2.putText(img_with_boxes, f"{class_name} {confidence:.2f}", (int(x1), int(y1) - 5),
                                   cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 255), 2)
                else:
                    logger.info("   No detections found")
                    
            except Exception as e:
                logger.error(f"Error during OpenCV DNN inference: {str(e)}")
                logger.warning("Returning empty detections")
                return {
                    "detections": [],
                    "image": "",
                    "count": 0,
                    "width": width,
                    "height": height,
                    "error": f"Detection failed: {str(e)}"
                }
        else:
            logger.warning("TFLite model not available - returning empty detections")
            logger.info("Please ensure water_detection.tflite is in the model directory")

        # Save detected image to folder
        output_dir = os.path.join(script_dir, "detected_images")
        os.makedirs(output_dir, exist_ok=True)
        
        timestamp = int(time.time() * 1000)
        output_path = os.path.join(output_dir, f"detected_{timestamp}.jpg")
        cv2.imwrite(output_path, img_with_boxes)
        
        logger.info(f"   💾 Saved to: detected_images/detected_{timestamp}.jpg")

        # Encode image to base64
        _, buffer = cv2.imencode('.jpg', img_with_boxes)
        img_base64 = base64.b64encode(buffer).decode('utf-8')

        elapsed_time = time.time() - start_time
        logger.info(f"✅ Detection complete! ({elapsed_time:.2f}s)")
        logger.info(f"   Total detections: {len(detections)}\n")

        return {
            "detections": detections,
            "image": img_base64,
            "count": len(detections),
            "width": width,
            "height": height,
            "saved_image": output_path,
            "processing_time_seconds": round(elapsed_time, 2)
        }
        
    except Exception as e:
        logger.error(f"❌ Error processing image: {str(e)}")
        logger.error(f"   Type: {type(e).__name__}")
        import traceback
        logger.error(traceback.format_exc())
        
        return {
            "error": str(e),
            "detections": [],
            "count": 0
        }


if __name__ == "__main__":
    import uvicorn
    logger.info("🚀 Starting TFLite Water Detection API on port 8087...")
    uvicorn.run(app, host="0.0.0.0", port=8087)
