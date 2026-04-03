# Need to add model tflite file in the folder -> can be easily found in mediapipe / google websites
import asyncio
import base64
import math
import os
import uvicorn
from datetime import datetime
from fastapi import FastAPI, UploadFile, File, HTTPException, Query
import cv2
import numpy as np
import config
import logging
import sys
import mediapipe as mp
from mediapipe.tasks import python
from mediapipe.tasks.python import vision

# Configure logging
logging.basicConfig(
    format='%(asctime)s %(levelname)-8s %(message)s',
    level=logging.INFO,
    datefmt='%Y-%m-%d %H:%M:%S'
)
logging.getLogger().setLevel(logging.INFO)

app = FastAPI()

# Initialize MediaPipe Face Detection (Tasks API)
MODEL_PATH = 'models/blaze_face_short_range.tflite'

try:
    base_options = python.BaseOptions(model_asset_path=MODEL_PATH)
    options = vision.FaceDetectorOptions(base_options=base_options, min_detection_confidence=0.5)
    face_detector = vision.FaceDetector.create_from_options(options)
except Exception as e:
    logging.error(f"Failed to initialize MediaPipe FaceDetector: {e}")
    logging.error(f"Make sure '{MODEL_PATH}' is present in the directory.")
    sys.exit(1)


def check_face_orientation(detection, image_width, image_height):
    """
    Returns: "frontal", "looking_left", "looking_right", "tilted", "looking_up", "looking_down", "upside_down"
    Based on MediaPipe Keypoints (0: Left Eye, 1: Right Eye, 2: Nose, 3: Mouth, 4: Left Ear, 5: Right Ear)
    Image Y increases downward.
    """
    kp = detection.keypoints

    # Pixel coordinates (normalized 0-1, Y increases downward)
    l_eye_x = kp[0].x * image_width
    l_eye_y = kp[0].y * image_height
    r_eye_x = kp[1].x * image_width
    r_eye_y = kp[1].y * image_height
    nose_y = kp[2].y * image_height
    mouth_y = kp[3].y * image_height
    eye_center_y = (l_eye_y + r_eye_y) / 2.0

    # 1. Upside down: mouth above eyes in image (photo/face rotated 180°)
    if mouth_y < eye_center_y - (image_height * 0.02):
        return "upside_down"

    # # 2. Roll (tilt): scale-invariant – use vertical eye diff vs inter-eye distance
    # eye_vertical_diff = abs(r_eye_y - l_eye_y)
    # inter_eye_dist = math.hypot(r_eye_x - l_eye_x, r_eye_y - l_eye_y)
    # if inter_eye_dist > 2 and (eye_vertical_diff / inter_eye_dist) > 0.08:
    #     return "tilted"

    # 3. Pitch (looking up / down): nose position between eyes and mouth
    # Frontal: nose between eyes and mouth. Looking up: nose near eyes. Looking down: nose near mouth.
    eyes_to_mouth_span = mouth_y - eye_center_y
    if eyes_to_mouth_span > (image_height * 0.02):
        nose_offset = (nose_y - eye_center_y) / eyes_to_mouth_span  # 0 = at eyes, 1 = at mouth
        if nose_offset < 0.35:
            return "looking_down" # nose close to eyes → camera below
        if nose_offset > 0.65:
            return "looking_up" # nose close to mouth → camera above

    # 4. Yaw (looking left/right)
    nose_x = kp[2].x * image_width
    l_eye_x = kp[0].x * image_width
    r_eye_x = kp[1].x * image_width

    # Find the horizontal bounds of the eyes
    left_boundary = min(l_eye_x, r_eye_x)  # The eye on the left side of the image
    right_boundary = max(l_eye_x, r_eye_x) # The eye on the right side of the image

    # 1. Strict Profile Check
    # If the nose has crossed past the outer edge of an eye, it's a full profile turn.
    if nose_x < left_boundary:
        return "looking_right"  # Nose crossed the image-left eye
    if nose_x > right_boundary:
        return "looking_left"   # Nose crossed the image-right eye

    # 2. Centering Check (The "Middle" Logic)
    # Calculate distance from nose to the inner corner of each eye vertical line
    dist_to_left_bound = nose_x - left_boundary
    dist_to_right_bound = right_boundary - nose_x

    # Prevent division by zero (unlikely if profile check passed, but safe to keep)
    if dist_to_left_bound <= 0 or dist_to_right_bound <= 0:
        return "angled"

    # Calculate the ratio
    # If centered, ratio is ~1.0. 
    # If ratio > 2.0 or < 0.5, the nose is drifting too close to one eye.
    ratio = dist_to_right_bound / dist_to_left_bound

    if ratio < 0.33: 
        return "looking_left"  # Closer to right boundary (Image Right)
    if ratio > 3: 
        return "looking_right" # Closer to left boundary (Image Left)

    return "frontal"


def detect_face_mediapipe(img_array):
    """
    Detects face using MediaPipe Tasks API.
    Returns: detection object, (x, y, w, h), face_image (numpy array)
    """
    try:
        h, w, _ = img_array.shape
        
        # MediaPipe works with RGB, OpenCV uses BGR
        img_rgb = cv2.cvtColor(img_array, cv2.COLOR_BGR2RGB)
        
        # Create MediaPipe Image
        mp_image = mp.Image(image_format=mp.ImageFormat.SRGB, data=img_rgb)
        
        # Run detection
        detection_result = face_detector.detect(mp_image)
        
        if not detection_result.detections:
            logging.warning("No face detected by MediaPipe")
            return None, None, None

        # Get the first face (highest confidence)
        detection = detection_result.detections[0]
        bbox = detection.bounding_box
        
        # BoundingBox in Tasks API gives origin_x, origin_y, width, height in pixels
        x = bbox.origin_x
        y = bbox.origin_y
        width = bbox.width
        height = bbox.height

        # Padding Check: Ensure we don't crop outside the image
        x = max(0, x)
        y = max(0, y)
        width = min(width, w - x)
        height = min(height, h - y)

        # Crop the face
        face_img = img_array[y:y+height, x:x+width]

        return detection, (x, y, width, height), face_img
    
    except Exception as e:
        logging.error(f"Error in face detection: {type(e).__name__}: {e}")
        return None, None, None


def is_blurry_laplacian(gray_image, thresh=None):
    """
    Blur detection via Laplacian variance (sharpness).
    Higher variance = sharper. Below threshold = blurry.
    Uses edge-preserving denoise before Laplacian so the score reflects real
    sharpness, not digital noise (e.g. high-ISO grain). Returns (is_blurry, sharpness_score).
    """
    if thresh is None:
        thresh = config.LAPLACIAN_BLUR_THRESHOLD
    denoised = cv2.fastNlMeansDenoising(gray_image, h=10)
    laplacian = cv2.Laplacian(denoised, cv2.CV_64F, ksize=3)
    sharpness_score = laplacian.var()
    return sharpness_score < thresh, sharpness_score


def check_exposure_histogram(gray_face):
    """
    Check if pixels are clustered at extremes (0 for dark, 255 for bright).
    Returns exposure status string and percentage dict.
    """
    hist = cv2.calcHist([gray_face], [0], None, [256], [0, 256])
    total_pixels = gray_face.shape[0] * gray_face.shape[1]
    
    dark_pixels = np.sum(hist[:30])  # Sum pixels with value 0-30
    bright_pixels = np.sum(hist[225:])  # Sum pixels with value 225-255
    
    dark_ratio = dark_pixels / total_pixels
    bright_ratio = bright_pixels / total_pixels
    
    if dark_ratio > config.HISTOGRAM_DARK_THRESHOLD:
        return "too_dark", {"dark_ratio": dark_ratio, "bright_ratio": bright_ratio}
    elif bright_ratio > config.HISTOGRAM_BRIGHT_THRESHOLD:
        return "too_bright", {"dark_ratio": dark_ratio, "bright_ratio": bright_ratio}
    return "good", {"dark_ratio": dark_ratio, "bright_ratio": bright_ratio}


DEBUG_OUTPUT_DIR = "debug-output"
KEYPOINT_LABELS = ("left_eye", "right_eye", "nose", "mouth", "left_ear", "right_ear")


def save_debug_image(
    image,
    detection,
    bbox,
    face_orientation,
    is_blurry,
    sharpness_score,
    exposure_status,
    exposure_ratios,
    quality_check_passed,
    img_width,
    img_height,
):
    """Draw face rect, keypoints, and info on image; save to debug-output/."""
    os.makedirs(DEBUG_OUTPUT_DIR, exist_ok=True)
    debug_img = image.copy()
    x, y, w, h = bbox

    # Face bounding box (green)
    cv2.rectangle(debug_img, (x, y), (x + w, y + h), (0, 255, 0), 2)

    # Keypoints: circles and labels
    colors = [(255, 0, 0), (0, 255, 255), (255, 165, 0), (255, 0, 255), (128, 128, 0), (128, 0, 128)]
    for i, kp in enumerate(detection.keypoints):
        px = int(kp.x * img_width)
        py = int(kp.y * img_height)
        cv2.circle(debug_img, (px, py), 5, colors[i % len(colors)], -1)
        cv2.putText(
            debug_img,
            KEYPOINT_LABELS[i],
            (px + 6, py + 4),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.35,
            colors[i % len(colors)],
            1,
        )

    # Info block (top-left, dark background for readability)
    font = cv2.FONT_HERSHEY_SIMPLEX
    font_scale = 0.5
    thickness = 1
    line_height = 20
    pad = 8
    lines = [
        f"orientation: {face_orientation}",
        f"sharpness_score: {sharpness_score:.1f} (higher=sharper, thresh: {config.LAPLACIAN_BLUR_THRESHOLD})",
        f"is_blurry: {is_blurry}",
        f"exposure: {exposure_status}",
        f"dark_ratio: {exposure_ratios['dark_ratio']:.3f}",
        f"bright_ratio: {exposure_ratios['bright_ratio']:.3f}",
        f"quality_passed: {quality_check_passed}",
    ]
    box_h = len(lines) * line_height + pad * 2
    box_w = pad * 2
    for line in lines:
        (tw, _), _ = cv2.getTextSize(line, font, font_scale, thickness)
        box_w = max(box_w, tw + pad * 2)
    cv2.rectangle(debug_img, (0, 0), (box_w, box_h), (40, 40, 40), -1)
    cv2.rectangle(debug_img, (0, 0), (box_w, box_h), (200, 200, 200), 1)
    for i, line in enumerate(lines):
        cv2.putText(
            debug_img,
            line,
            (pad, pad + (i + 1) * line_height),
            font,
            font_scale,
            (220, 220, 220),
            thickness,
        )

    # Unique filename
    ts = datetime.utcnow()
    filename = f"face_quality_{ts}.png"
    filepath = os.path.join(DEBUG_OUTPUT_DIR, filename)
    cv2.imwrite(filepath, debug_img)
    logging.info(f"Debug image saved: {filepath}")
    return filepath


@app.post("/face-quality/verify-face-quality")
async def verify_face_quality(
    file: UploadFile = File(...),
    debug: bool = Query(False, description="Save a debug image to debug-output/"),
):
    try:
        # Read image file
        contents = await file.read()
        nparr = np.frombuffer(contents, np.uint8)
        image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        if image is None:
            raise HTTPException(status_code=400, detail="Invalid image file")

        # Get image dimensions for orientation check
        img_height, img_width = image.shape[:2]

        # Detect face using MediaPipe
        detection, bbox, face_img = detect_face_mediapipe(image)

        if detection is None or bbox is None or face_img is None:
            return {
                "status": "failed",
                "message": "No face detected"
            }

        x, y, w, h = bbox

        # Check face orientation
        face_orientation = check_face_orientation(detection, img_width, img_height)

        # Resize face image to fixed width
        face_img = cv2.resize(face_img, (config.FIXED_WIDTH, config.FIXED_WIDTH))

        # Convert face to grayscale for analysis
        # MediaPipe returns BGR image, convert to grayscale
        face_gray = cv2.cvtColor(face_img, cv2.COLOR_BGR2GRAY)

        # Check blurriness using FFT
        is_blurry, sharpness_score = is_blurry_laplacian(face_gray)

        # Check exposure using histogram analysis
        exposure_status, exposure_ratios = check_exposure_histogram(face_gray)
        is_too_dark = exposure_status == "too_dark"
        is_too_bright = exposure_status == "too_bright"

        quality_check_passed = not (is_blurry or is_too_dark or is_too_bright or face_orientation != "frontal")

        # Optionally save debug image (run in thread pool to avoid blocking the event loop)
        debug_image_path = None
        if debug:
            debug_image_path = await asyncio.to_thread(
                save_debug_image,
                image,
                detection,
                bbox,
                face_orientation,
                is_blurry,
                sharpness_score,
                exposure_status,
                exposure_ratios,
                quality_check_passed,
                img_width,
                img_height,
            )

        # Convert numpy types to native Python for JSON serialization
        result = {
            "status": "success",
            "quality_check_passed": bool(quality_check_passed),
            "details": {
                "face_detected": True,
                "face_location": {
                    "x": int(x),
                    "y": int(y),
                    "w": int(w),
                    "h": int(h)
                },
                "face_orientation": face_orientation,
                "blur": {
                    "is_blurry": bool(is_blurry),
                    "sharpness_score": float(sharpness_score),
                    "threshold": float(config.LAPLACIAN_BLUR_THRESHOLD)
                },
                "exposure": {
                    "status": exposure_status,
                    "is_too_dark": bool(is_too_dark),
                    "is_too_bright": bool(is_too_bright),
                    "dark_pixel_ratio": float(exposure_ratios['dark_ratio']),
                    "bright_pixel_ratio": float(exposure_ratios['bright_ratio']),
                    "thresholds": {
                        "dark": float(config.HISTOGRAM_DARK_THRESHOLD),
                        "bright": float(config.HISTOGRAM_BRIGHT_THRESHOLD)
                    }
                }
            }
        }
        if debug_image_path is not None:
            result["debug_image_path"] = debug_image_path
        return result

    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Error processing image: {type(e).__name__}: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/face-quality/ping")
async def ping():
    return "pong"

if __name__ == '__main__':
    logging.info("Starting Face Quality Server")
    uvicorn.run(app, host='0.0.0.0', port=8001)