import os
import time

import cv2
from dotenv import load_dotenv
from fastapi import APIRouter, Query
from fastapi.responses import StreamingResponse
from server.detectors.person_body import detect_person_body
from server.detectors.weapon import detect_weapon

load_dotenv()
router = APIRouter()

VIDEOS_PATH = os.getenv("VIDEOS_PATH")

default_video_map = {
    "crowd_detection": "person/test.mp4",
    "weapon_detection": "weapon/test4.mp4",
}


# Function to generate video frames
def generate_frames(active_model: str, use_webcam: bool, upload_file_idx: int):
    all_upload_files = sorted(os.listdir(f"{VIDEOS_PATH}/custom"))

    if use_webcam:
        cap = cv2.VideoCapture(0)
    elif upload_file_idx != -1 and upload_file_idx < len(all_upload_files):
        file_name = all_upload_files[upload_file_idx]
        cap = cv2.VideoCapture(f"{VIDEOS_PATH}/custom/{file_name}")
    elif active_model in ["crowd_detection", "weapon_detection"]:
        cap = cv2.VideoCapture(f"{VIDEOS_PATH}/{default_video_map[active_model]}")
    else:
        cap = cv2.VideoCapture(f"{VIDEOS_PATH}/{default_video_map["crowd_detection"]}")

    fps = cap.get(cv2.CAP_PROP_FPS)
    if fps == 0:
        fps = 30
    frame_delay = 1 / fps

    while True:
        start_time = time.time()
        success, frame = cap.read()

        if not success:
            print("Unable to capture video")
            break

        # Process frame
        if active_model == "crowd_detection":
            detect_person_body(frame)

        if active_model == "weapon_detection":
            detect_weapon(frame)

        # Encode frame in JPEG format
        _, buffer = cv2.imencode(".jpg", frame)
        frame = buffer.tobytes()

        # Yield the frame with a specific format for streaming
        yield (b"--frame\r\n" + b"Content-Type: image/jpeg\r\n\r\n" + frame + b"\r\n")

        processing_time = time.time() - start_time
        if processing_time < frame_delay:
            time.sleep(frame_delay - processing_time)

    cap.release()


@router.get("/stream-video")
def video_feed(
    active_model: str = Query(
        "crowd_detection", description="[crowd_detection / weapon_detection]"
    ),
    use_webcam: bool = Query(False, description="[true / false]"),
    upload_file_idx: int = Query(-1, description="[index of custom video path]"),
):
    return StreamingResponse(
        generate_frames(active_model, use_webcam, upload_file_idx),
        media_type="multipart/x-mixed-replace; boundary=frame",
    )
