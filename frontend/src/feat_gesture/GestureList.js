import React from "react";
import PageFirst from "../PageFirst";
import "./css/GestureList.css";
import { useLocation } from "react-router-dom";
import GestureImage from "./GestureImage";

const GestureList = () => {
  const header = {
    title: "실시간 영상",
    type: "back"
  }
  const location = useLocation();
  const gestureList = location.state?.gestureList;

  return (
    <PageFirst header={header}>
      <div className="gestures">
        {gestureList.map((gesture) => (
          <GestureImage key={gesture.gestureId} gesture={gesture} />
        ))}
      </div>
    </PageFirst>
  )
}

export default GestureList;