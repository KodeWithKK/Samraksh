import asyncio

from fastapi import APIRouter, FastAPI, WebSocket
from server.data.detection_meta import detection_meta
from starlette.websockets import WebSocketDisconnect

app = FastAPI()
router = APIRouter()


# Function to generate person count via WebSocket
async def send_person_count(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            await websocket.send_json(detection_meta)
            await asyncio.sleep(0.15)  # Adjust this delay as needed
    except WebSocketDisconnect:
        print("WebSocket disconnected")


@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await send_person_count(websocket)


app.include_router(router)
