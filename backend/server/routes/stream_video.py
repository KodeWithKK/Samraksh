import time

import cv2
from fastapi import APIRouter, Query
from fastapi.responses import StreamingResponse
from server.detectors.person_body import detect_person_body
from server.detectors.weapon import detect_weapon

router = APIRouter()

default_video_map = {
    "person_detection": "/person/test.mp4",
    "weapon_detection": "/weapon/test4.mp4",
}


# Function to generate video frames
def generate_frames(active_model: str, use_webcam: bool):
    if use_webcam:
        cap = cv2.VideoCapture(0)
    elif active_model in ["person_detection", "weapon_detection"]:
        cap = cv2.VideoCapture(
            f"./server/assets/videos{default_video_map[active_model]}"
        )
    else:
        cap = cv2.VideoCapture(
            f"./server/assets/videos{default_video_map["person_detection"]}"
        )

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
        if active_model == "person_detection":
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
        "person_detection", description="[person_detection / weapon_detection]"
    ),
    use_webcam: bool = Query(False, description="[true / false]"),
):
    return StreamingResponse(
        generate_frames(active_model, use_webcam),
        media_type="multipart/x-mixed-replace; boundary=frame",
    )
