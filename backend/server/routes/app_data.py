import os
import shutil

from dotenv import load_dotenv
from fastapi import APIRouter, File, UploadFile
from fastapi.responses import JSONResponse

load_dotenv()
router = APIRouter()

VIDEOS_PATH = os.getenv("VIDEOS_PATH")


@router.get("/list-uploaded-videos")
async def list_uploaded_videos():
    return JSONResponse(content={"data": sorted(os.listdir(f"{VIDEOS_PATH}/custom"))})


@router.post("/upload")
async def upload_video(file: UploadFile = File(...)):
    try:
        with open(f"{VIDEOS_PATH}/custom/{file.filename}", "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        return JSONResponse(
            content={"message": "Upload successful", "filename": file.filename}
        )
    except Exception as e:
        return JSONResponse(
            content={"message": f"An error occurred: {str(e)}"}, status_code=500
        )
