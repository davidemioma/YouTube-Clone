import React from "react";

interface Props {
  videoSrc: string;
  height: string;
}

const VideoPlayer = ({ videoSrc, height }: Props) => {
  return (
    <video
      className="w-full object-cover"
      src={videoSrc}
      style={{ height: `${height}px` }}
      loop
      controls
    />
  );
};

export default VideoPlayer;
