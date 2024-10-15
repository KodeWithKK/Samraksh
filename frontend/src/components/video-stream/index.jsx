const VideoStream = ({ activeModel, useWebcam }) => {
  return (
    <div>
      <img
        src={`http://localhost:8000/stream-video?active_model=${activeModel}&use_webcam=${useWebcam}`}
        alt="Video Stream"
        className="max-h-[72vh]"
      />
    </div>
  );
};

export default VideoStream;
