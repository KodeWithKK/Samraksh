import {
  useState,
  useEffect,
  useCallback,
  createContext,
  useContext,
  useMemo,
} from "react";

const AppContext = createContext();
export const useAppContext = () => useContext(AppContext);

function AppProvider({ children }) {
  const [streamData, setStreamData] = useState();
  const [customUploadFileList, setCustomUploadFileList] = useState([]);

  const connectWebSocket = useCallback(() => {
    const ws = new WebSocket("ws://localhost:8000/ws");
    ws.onopen = () => console.log("WebSocket connection established");
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setStreamData(data);
    };
    ws.onerror = (error) => console.error("WebSocket error:", error);
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

  const fetchCustomUploadFileList = useCallback(async () => {
    await fetch("http://localhost:8000/list-uploaded-videos")
      .then((res) => res.json())
      .then((data) => {
        setCustomUploadFileList(data?.data);
      })
      .catch(() =>
        console.log("Something went wrong while uploaded list videos"),
      );
  }, []);

  useEffect(() => {
    const ws = connectWebSocket();
    fetchCustomUploadFileList();
    return () => ws && ws.close();
  }, [connectWebSocket, fetchCustomUploadFileList]);

  const value = useMemo(
    () => ({
      streamData,
      customUploadFileList,
      fetchCustomUploadFileList,
    }),
    [streamData, customUploadFileList, fetchCustomUploadFileList],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export default AppProvider;
