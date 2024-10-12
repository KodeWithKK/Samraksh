import { useState, useCallback, useEffect } from "react";

const VideoStream = () => {
  const [count, setCount] = useState(0);

  const connectWebSocket = useCallback(() => {
    const ws = new WebSocket("ws://localhost:8000/ws");

    ws.onopen = () => {
      console.log("WebSocket connection established");
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setCount(data.active_persons);
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");
      // Attempt to reconnect after a short delay
      setTimeout(() => {
        console.log("Reconnecting...");
        connectWebSocket();
      }, 1000);
    };

    return ws;
  }, []);

  useEffect(() => {
    const ws = connectWebSocket();

    return () => {
      if (ws) ws.close();
    };
  }, [connectWebSocket]);

  return (
    <div>
      <img
        src="http://localhost:8000/stream-video"
        alt="Video Stream"
        className="max-h-[75vh]"
      />
      <div>Active Persons: {count}</div>
    </div>
  );
};

export default VideoStream;
