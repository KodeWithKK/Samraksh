import { useEffect, useState } from "react";
import cn from "@/utils/cn";

import VideoStream from "./components/video-stream";

function App() {
  const [isBackendActive, setIsBackendActive] = useState();

  useEffect(() => {
    fetch("http://localhost:8000/ping")
      .then((res) => res.json())
      .then((data) => setIsBackendActive(data?.isActive))
      .catch(() => console.log("Connection Refused"));
  }, []);

  return (
    <div className="p-6">
      <h1>Live Video Stream</h1>

      <div
        className={cn(
          "mb-2 inline-block rounded-md bg-slate-200 px-1.5 py-0.5",
          isBackendActive && "bg-green-200",
        )}
      >
        <p>Backend Status: {isBackendActive ? "Active" : "Inactive"}</p>
      </div>
      <br />

      {isBackendActive && <VideoStream />}
    </div>
  );
}

export default App;
