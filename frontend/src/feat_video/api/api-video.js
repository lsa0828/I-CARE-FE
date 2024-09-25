import { call } from "../../api/ApiService";
import { API_BASE_URL } from "../../api/api-config";

export const getRunning = () => {
  const childId = localStorage.getItem("childId");
  return call(`/api/video/running?childId=${childId}`, "GET", null)
    .then((response) => {
      if(response) {
        return response;
      }
    })
}

export const startVideo = () => {
  const childId = localStorage.getItem("childId");
  return call(`/api/video/start?childId=${childId}`, "POST", null)
    .then((response) => {
      if(response) {
        return response;
      }
    });
}

export const stopVideo = () => {
  const childId = localStorage.getItem("childId");
  return call(`/api/video/stop?childId=${childId}`, "POST", null)
    .then((response) => {
      if(response) {
        return response;
      }
    });
}

export const getStream = () => {
  const childId = localStorage.getItem("childId");
  //return `${API_BASE_URL}/api/video/stream?childId=${childId}`;
  return `http://localhost:5000/video/stream?childId=${childId}`;
}

export const getStatus = () => {
  const childId = localStorage.getItem("childId");
  const accessToken = localStorage.getItem("ACCESS_TOKEN");
  const url = `ws://localhost:8080/ws/video/status`;
  const socket = new WebSocket(url);
  socket.onopen = () => {
    console.log("WebSocket connection established");
    if (accessToken && childId) {
      socket.send(JSON.stringify({ 
        token: accessToken,
        childId: childId
      }));
    }
  };
  socket.onerror = (error) => {
    console.error("WebSocket error: ", error);
  };
  socket.onclose = () => {
    console.log("WebSocket connection closed");
  };
  return socket;
  //return `http://localhost:5000/video/status?childId=${childId}`;
}

export const getVideoImage = (videoId) => {
  const childId = localStorage.getItem("childId");
  return call(`/api/video/image?childId=${childId}&videoId=${videoId}`, "GET", null)
    .then((response) => {
      if(response) {
        return response;
      }
    })
}