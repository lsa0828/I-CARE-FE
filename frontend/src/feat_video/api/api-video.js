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
  const accessToken = localStorage.getItem("ACCESS_TOKEN");
  const url = `ws://localhost:8080/ws/video/stream`;
  const socket = new WebSocket(url);
  socket.onopen = () => {
    console.log("WebSocket stream connection established");
    if (accessToken && childId) {
      socket.send(JSON.stringify({ 
        token: accessToken,
        childId: childId
      }));
    }
  };
  socket.onerror = (error) => {
    console.error("WebSocket stream error: ", error);
  };
  socket.onclose = () => {
    console.log("WebSocket stream closed");
    setTimeout(() => {}, 1000);
  };
  return socket;
}

export const getStatus = () => {
  const childId = localStorage.getItem("childId");
  const accessToken = localStorage.getItem("ACCESS_TOKEN");
  const url = `ws://localhost:8080/ws/video/status`;
  const socket = new WebSocket(url);
  socket.onopen = () => {
    console.log("WebSocket status connection established");
    if (accessToken && childId) {
      socket.send(JSON.stringify({ 
        token: accessToken,
        childId: childId
      }));
    }
  };
  socket.onerror = (error) => {
    console.error("WebSocket status error: ", error);
  };
  socket.onclose = () => {
    console.log("WebSocket status closed");
  };
  return socket;
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