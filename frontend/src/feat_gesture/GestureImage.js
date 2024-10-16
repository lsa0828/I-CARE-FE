import React, { useEffect, useState } from "react";
import { getGestureImage } from "./api/api-gesture";

const GestureImage = (props) => {
  const gesture = props.gesture;
  const label = gesture.label;
  const [image, setImage] = useState();

  useEffect(() => {
    getGestureImage(gesture.gestureId)
      .then(response => {
        if(response) {
          setImage(response);
        }
      })
      .catch(error => {
        console.error('Error fetching image URL: ', error);
      });
  });

  return (
    <div className="gesture">
      <div className="label">
        {label}
      </div>
      <div className="image">
        <img src={image} alt="gesture_image" />
      </div>
    </div>
  );
}

export default GestureImage;