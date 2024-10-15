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

function AppContextProvider({ children }) {
  const [streamData, setStreamData] = useState();

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

  useEffect(() => {
    const ws = connectWebSocket();
    return () => ws && ws.close();
  }, [connectWebSocket]);

  const value = useMemo(
    () => ({
      streamData,
    }),
    [streamData],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export default AppContextProvider;
