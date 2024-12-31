import React, { useRef } from "react";

const VideoPage: React.FC = () => {
    const videoRef = useRef<HTMLVideoElement>(null);

  const handlePlay = () => {
    if (videoRef.current) {
      videoRef.current.play();
    }
  };

  const handlePause = () => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  return (
    <div className="video-container p-6 max-w-4xl mx-auto space-y-6 relative py-20 px-4">
      <h1 className="text-3xl font-bold text-gray-350 text-center mb-6">
        Video Player
      </h1>
      <div className="flex flex-col items-center space-y-4">
        <video
          ref={videoRef}
          className="w-full rounded-lg shadow-md"
          controls
          width="720"
        >
          <source
            src="./public/demo/demo.mp4"
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video>
        <div className="flex space-x-4">
          <button
            onClick={handlePlay}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg"
          >
            Play
          </button>
          <button
            onClick={handlePause}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-lg"
          >
            Pause
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoPage;
