from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
from ultralytics import YOLO
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
model_path = os.path.join(script_dir, "road.pt")

logger.info(f"Loading model from: {model_path}")
logger.info(f"Model exists: {os.path.exists(model_path)}")

model = YOLO(model_path)
logger.info(f"✓ Model loaded! Classes: {model.names}")

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

        logger.info("   🔍 Running YOLO detection...")
        results = model(img, conf=0.5)

        detections = []
        img_with_boxes = img.copy()

        for r in results:
            logger.info(f"   Found {len(r.boxes)} objects")
            for i, box in enumerate(r.boxes):
                x1, y1, x2, y2 = box.xyxy[0].tolist()
                confidence = float(box.conf[0])
                class_id = int(box.cls[0])
                class_name = model.names[class_id]

                detections.append({
                    "x1": round(x1, 2),
                    "y1": round(y1, 2),
                    "x2": round(x2, 2),
                    "y2": round(y2, 2),
                    "confidence": round(confidence, 4),
                    "class": class_name,
                    "class_id": class_id
                })
                
                logger.info(f"     ✓ {class_name}: {confidence:.1%}")

                # Draw bounding box
                cv2.rectangle(img_with_boxes, (int(x1), int(y1)), (int(x2), int(y2)), (0, 0, 255), 2)

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
    # YOLO API running on port 8087 - backend connects to this
    logger.info("🚀 Starting YOLO Detection API on port 8087...")
    uvicorn.run(app, host="0.0.0.0", port=8087)
