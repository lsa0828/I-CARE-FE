import React from "react";
import PageFirst from "../PageFirst";
import Video from "./Video";
import "./css/VideoList.css";
import { useLocation } from "react-router-dom";

const VideoList = () => {
  const header = {
    title: "실시간 영상 피드백",
    type: "back"
  }
  const location = useLocation();
  const videoList = location.state?.videoList;

  return (
    <PageFirst header={header}>
      <div className="videos">
        {videoList.map((video) => (
          <Video key={video.videoId} video={video} />
        ))}
      </div>
    </PageFirst>
  )
}

export default VideoList;