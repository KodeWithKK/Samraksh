import AppProvider from "./context/app-provider";
import VideoStreamPage from "./page/video-stream";

function App() {
  return (
    <AppProvider>
      <div className="p-6">
        <VideoStreamPage />
      </div>
    </AppProvider>
  );
}

export default App;
