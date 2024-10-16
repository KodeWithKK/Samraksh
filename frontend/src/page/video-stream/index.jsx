import { useAppContext } from "@/context/app-provider";
import VideoStream from "@/components/video-stream";
import VideoUpload from "@/components/video-upload";
import { useState } from "react";

function VideoStreamPage() {
  const { streamData, customUploadFileList } = useAppContext();
  const [activeModel, setActiveModel] = useState("crowd_detection");
  const [activeUploadFileIdx, setActiveUploadFileIdx] = useState(-1);
  const [useWebcam, setUseWebcam] = useState(false);

  return (
    <div className="flex gap-2">
      <div>
        <div className="mb-2 flex gap-2">
          <div className="flex items-center gap-2">
            <span>Detect: </span>
            <select
              value={activeModel}
              onChange={(e) => setActiveModel(e.target.value)}
            >
              <option value="crowd_detection">Crowd</option>
              <option value="weapon_detection">Weapon</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span>Use Webcam: </span>
            <select
              value={useWebcam}
              onChange={(e) => setUseWebcam(e.target.value)}
            >
              <option value={true}>Yes</option>
              <option value={false}>No</option>
            </select>
          </div>

          {!useWebcam && (
            <div className="flex items-center gap-2">
              <span>Video Source: </span>
              <select
                value={activeUploadFileIdx}
                onChange={(e) => setActiveUploadFileIdx(e.target.value)}
                className="w-[200px]"
              >
                <option value={-1}>Default</option>
                {customUploadFileList.map((filename, idx) => (
                  <option key={filename} value={idx}>
                    {filename}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <VideoStream
          activeModel={activeModel}
          useWebcam={useWebcam}
          uploadFileIdx={activeUploadFileIdx}
        />
      </div>

      <div className="basis-[40%] space-y-3">
        <div>
          <h3>Detection Data</h3>
          <p>Active Persons: {streamData?.active_persons}</p>
        </div>

        <div>
          <h3>Upload Custom Video</h3>
          <VideoUpload />
        </div>

        <div>
          <h3>Custom Upload Filelist</h3>
          <div className="mt-2 space-y-2 text-[15px]">
            {customUploadFileList.map((filename) => (
              <p key={filename}>┗ {filename}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default VideoStreamPage;
