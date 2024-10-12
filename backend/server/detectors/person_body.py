import math

import cv2
import cvzone
from server.data.detection_meta import detection_meta
from server.data.yolo_classnames import classNames
from ultralytics import YOLO

model = YOLO("./server/assets/models/yolov8n.pt")


def detect_person_body(frame):
    results = model(frame, stream=True)
    active_persons = 0

    for r in results:
        boxes = r.boxes

        for box in boxes:
            # Bounding Box
            x1, y1, x2, y2 = box.xyxy[0]
            x1, y1, x2, y2 = int(x1), int(y1), int(x2), int(y2)
            w, h = x2 - x1, y2 - y1
            conf = math.ceil((box.conf[0] * 100)) / 100

            # ClassName
            cls = int(box.cls[0])
            current_class = classNames[cls]
            required_classes = ["person"]

            if current_class in required_classes and conf > 0.1:
                active_persons += 1
                cvzone.cornerRect(frame, (x1, y1, w, h))
                cvzone.putTextRect(
                    frame,
                    text=f"{current_class.capitalize()} {conf}",
                    pos=(max(0, x1), max(30, y1)),
                    font=cv2.FONT_HERSHEY_DUPLEX,
                    scale=0.6,
                    thickness=1,
                    offset=3,
                )

        detection_meta["active_persons"] = active_persons
