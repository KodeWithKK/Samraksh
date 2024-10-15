import AppContextProvider from "./context/app-context-provider";
import VideoStreamPage from "./page/video-stream";

function App() {
  return (
    <AppContextProvider>
      <div className="p-6">
        <VideoStreamPage />
      </div>
    </AppContextProvider>
  );
}

export default App;
