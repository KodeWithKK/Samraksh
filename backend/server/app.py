from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from server.routes.app_data import router as DataRouter
from server.routes.stream_video import router as VideoStreamRouter
from server.routes.websockets import router as WebsocketsRouter

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(VideoStreamRouter, tags=["Video Stream"], prefix="")
app.include_router(WebsocketsRouter, tags=["Realtime Response"], prefix="")
app.include_router(DataRouter, tags=["Data Operations"], prefix="")


@app.get("/ping", tags=["ping"])
def ping():
    return {"isActive": True}
