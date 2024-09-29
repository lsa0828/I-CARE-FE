import React, { useState, useEffect, useRef } from 'react';
import { Button, Card, CardContent, Typography } from '@mui/material';
import { Camera, StopCircle } from 'lucide-react';
import Modal from '../Modal';
import { getRunning, getStatus, getStream, startVideo, stopVideo } from './api/api-video';
import PageFirst from "../PageFirst";
import { useNavigate } from 'react-router-dom';

const StartVideo = () => {
  const header = {
    title: "실시간 영상",
    type: "home"
  };
  const navigate = useNavigate();
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentLabel, setCurrentLabel] = useState('');
  const imgRef = useRef(null);

  useEffect(() => {
    getRunning()
      .then(response => {
        if(response) {
          setIsRecording(response.running);
        }
      })
  }, []);

  const startCamera = async () => {
    setIsLoading(true);
    try {
      startVideo()
        .then(response => {
          if(response) {
            setIsLoading(false);
            setIsRecording(true);
          }
        })
    } catch (error) {
      console.error('Failed to start video:', error);
    }
  };

  const stopCamera = async () => {
    setIsLoading(true);
    try {
      stopVideo()
        .then(videoList => {
          if (!videoList || videoList.length === 0) {
            console.log('None');
          }
          setIsRecording(false);
          setIsLoading(false);
          navigate('/video/list', {state: {videoList}});
        }
      )
    } catch (error) {
      console.error('Failed to stop video:', error);
    }
  };

  useEffect(() => {
    let socket;
    if (isRecording) {
      socket = getStream();
      socket.onmessage = async (event) => {
        try {
          if (!event.data) return;
          const blob = new Blob([event.data], {type: 'image/jpeg'});
          if (imgRef.current) {
            const imgUrl = URL.createObjectURL(blob);
            imgRef.current.onload = () => {
              URL.revokeObjectURL(imgUrl);
            };
            imgRef.current.onerror = () => {
              console.error("Failed to load image");
            };
            imgRef.current.src = imgUrl;
          }
        } catch (error) {
          console.error("Error Parsing frame:", error);
        }
      };
    }
    if (!isRecording && imgRef.current) {
      imgRef.current.src = '';
    }
    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [isRecording]);

  useEffect(() => {
    let socket;
    if (isRecording) {
      socket = getStatus();
      socket.onmessage = (event) => {
        try {
          if(!event.data) return;
          const rawData = event.data.trim();
          const jsonData = rawData.replace(/^data:\s*/, "");
          const data = JSON.parse(jsonData);
          console.log("Parse currentLabel:", data);
          if(isRecording && data.currentLabel) {
            setCurrentLabel(data.currentLabel);
          }
        } catch (error) {
          console.error("Error parsing currentLabel:", error);
        }
      };
    }
    return () => {
      if(socket) {
        socket.close();
      }
    };
  }, [isRecording]);

  return (
    <PageFirst header={header}>
      <div>
        {isRecording ? (
          <Button onClick={stopCamera} disabled={!isRecording}>
            <StopCircle className="mr-2 h-4 w-4" /> 종료 후 결과 보기
          </Button>
        ) : (
          <Button onClick={startCamera} disabled={isRecording}>
            <Camera className="mr-2 h-4 w-4" /> 동영상 시작
          </Button>
        )}
      </div>
      <Card>
        <CardContent>
          <div className="aspect-video bg-gray-200 mb-4">
            {isRecording && (
              <div>
                <img ref={imgRef} alt="Video Stream" 
                  style={{width: '100%', height: 'auto', objectFit: 'cover'}} />
                {/*<video ref={imgRef} autoPlay
                  style={{width: '100%', height: '100%', objectFit: 'cover'}} />;*/}
                <div>
                  <Typography variant="h6" className="mb-2">감지 중...</Typography>
                  <p>{currentLabel ? currentLabel : '-'}</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      {isLoading && 
        <Modal>
          <p>잠시만 기다려주세요.</p>
        </Modal>
      }
    </PageFirst>
  );
};

export default StartVideo;