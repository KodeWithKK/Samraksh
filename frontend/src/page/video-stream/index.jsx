import { useAppContext } from "@/context/app-context-provider";
import VideoStream from "@/components/video-stream";
import { useState } from "react";

function VideoStreamPage() {
  const { streamData } = useAppContext();
  const [activeModel, setActiveModel] = useState("person_detection");
  const [useWebcam, setUseWebcam] = useState(false);

  return (
    <div>
      <h1>Live Video Stream</h1>

      <div className="mb-2 flex gap-4">
        <div className="flex items-center gap-2">
          <span>Detect: </span>
          <select
            value={activeModel}
            onChange={(e) => setActiveModel(e.target.value)}
          >
            <option value="person_detection">Person</option>
            <option value="weapon_detection">Weapon</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span>Use Webcam: </span>
          <select
            value={useWebcam}
            onChange={(e) => setUseWebcam(e.target.value)}
          >
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </div>
      </div>

      <VideoStream activeModel={activeModel} useWebcam={useWebcam} />
      <p>Active Persons: {streamData?.active_persons}</p>
    </div>
  );
}

export default VideoStreamPage;
