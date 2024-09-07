import React, { useEffect, useState } from "react";
import { getVideoImage } from "./api/api-video";

const Video = (props) => {
  const video = props.video;
  const label = video.label;
  const [image, setImage] = useState();

  useEffect(() => {
    getVideoImage(video.videoId)
      .then(response => {
        console.log(video.vieoId);
        if(response) {
          setImage(response);
        }
      })
      .catch(error => {
        console.error('Error fetching image URL: ', error);
      });
  });

  return (
    <div className="video">
      <div className="label">
        {label}
      </div>
      <div className="image">
        <img src={image} alt="video_image" />
      </div>
    </div>
  );
}

export default Video;