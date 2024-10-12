import time

import cv2
from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from server.detectors.person_body import detect_person_body

router = APIRouter()


# Function to generate video frames
def generate_frames():
    # cap = cv2.VideoCapture(0)
    cap = cv2.VideoCapture("./server/assets/videos/test2.mp4")

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
        detect_person_body(frame)

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
def video_feed():
    return StreamingResponse(
        generate_frames(), media_type="multipart/x-mixed-replace; boundary=frame"
    )
