import { call } from "../../api/ApiService";
import { API_BASE_URL } from "../../api/api-config";

export const startCamera = () => {
  const childId = localStorage.getItem("childId");
  return call(`/api/gesture/start?childId=${childId}`, "GET", null)
    .then((response) => {
      if(response) {
        return response;
      }
    });
}

export const stopCamera = () => {
  const childId = localStorage.getItem("childId");
  return call(`/api/gesture/stop?childId=${childId}`, "POST", null)
    .then((response) => {
      if(response) {
        return response;
      }
    });
}

export const againLabel = () => {
  const childId = localStorage.getItem("childId");
  return call(`/api/gesture/again?childId=${childId}`, "GET", null)
    .then((response) => {
      if(response) {
        return response;
      }
    });
}

export const getHintImage = () => {
  const childId = localStorage.getItem("childId");
  return call(`/api/gesture/image/hint?childId=${childId}`, "GET", null)
    .then((response) => {
      if(response) {
        return response;
      }
    });
}
/*
export const predictGesture = () => {
  const childId = localStorage.getItem("childId");
  return call(`/api/gesture/predict?childId=${childId}`, "GET", null)
    .then((response) => {
      if(response) {
        return response;
      }
    });
}*/

export const streamCamera = () => {
  const childId = localStorage.getItem("childId");
  const accessToken = localStorage.getItem("ACCESS_TOKEN");
  const url = `ws://localhost:8080/ws/gesture/stream`;
  //const url = `ws://icareappbe01-env.eba-zatbiksu.ap-northeast-2.elasticbeanstalk.com/ws/gesture/stream`;
  const socket = new WebSocket(url);
  socket.onopen = () => {
    console.log("WebSocket gesture connection established");
    if (accessToken && childId) {
      socket.send(JSON.stringify({ 
        token: accessToken,
        childId: childId
      }));
    }
  };
  socket.onerror = (error) => {
    console.error("WebSocket gesture error: ", error);
  };
  socket.onclose = () => {
    console.log("WebSocket gesture closed");
    setTimeout(() => {}, 1000);
  };
  return socket;
}

export const predictGesture = () => {
  const childId = localStorage.getItem("childId");
  const accessToken = localStorage.getItem("ACCESS_TOKEN");
  const url = `ws://localhost:8080/ws/gesture/label`;
  //const url = `ws://icareappbe01-env.eba-zatbiksu.ap-northeast-2.elasticbeanstalk.com/ws/gesture/label`;
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

export const getGestureImage = (gestureId) => {
  const childId = localStorage.getItem("childId");
  return call(`/api/gesture/image?childId=${childId}&gestureId=${gestureId}`, "GET", null)
    .then((response) => {
      if(response) {
        return response;
      }
    })
}