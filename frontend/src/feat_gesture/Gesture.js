import React, { useState, useEffect, useRef } from 'react';
import { Button, Card, CardContent } from '@mui/material';
import { Camera, StopCircle } from 'lucide-react';
import PageFirst from "../PageFirst";
import { useNavigate } from 'react-router-dom';
import { againLabel, getHintImage, predictGesture, startCamera, stopCamera, streamCamera } from './api/api-gesture';
import Modal from '../Modal';
import MSuccessGesture from './modal/MSuccessGesture';
import LoopIcon from '@mui/icons-material/Loop';

const Gesture = () => {
  const header = {
    title: "실시간 영상",
    type: "home"
  };
  const navigate = useNavigate();
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isHint, setIsHint] = useState(false);
  const [hintImage, setHintImage] = useState();
  const [corLabel, setCorLabel] = useState('');
  const [check1, setCheck1] = useState(false);
  const cameraRef = useRef(null);

  const openCamera = async () => {
    setIsLoading(true);
    try {
      startCamera()
        .then(response => {
          if(response) {
            setCorLabel(response.corLabel);
            setIsLoading(false);
            setIsRecording(true);
          }
        })
    } catch (error) {
      console.error('Failed to start camera:', error);
    }
  };

  const closeCamera = async () => {
    setIsLoading(true);
    try {
      setTimeout(() => {
        stopCamera()
          .then(gestureList => {
            if (!gestureList || gestureList.length === 0) {
              console.log('None');
            }
            setIsRecording(false);
            setIsLoading(false);
            navigate('/gesture/list', {state: {gestureList}});
          }
        )
      }, 1000);
    } catch (error) {
      console.error('Failed to stop camera:', error);
    }
  };

  const againCorLabel = async () => {
    try {
      againLabel()
        .then(response => {
          if(response) {
            setCorLabel(response.corLabel);
            setIsSuccess(false);
            setIsHint(false);
            setCheck1(false);
          }
        })
    } catch (error) {
      console.error('Failed to start camera:', error);
    }
  };

  const showHint = async () => {
    if(!isHint) {
      getHintImage()
      .then(response => {
        if(response) {
          setHintImage(response);
          setIsHint(!isHint);
        }
      })
      .catch(error => {
        console.error('Error fetching image URL: ', error);
      });
    }
  };

  useEffect(() => {
    let socket;
    if (isRecording) {
      socket = streamCamera();
      socket.onmessage = async (event) => {
        try {
          if (!event.data) return;
          const blob = new Blob([event.data], {type: 'image/jpeg'});
          if (cameraRef.current) {
            const imgUrl = URL.createObjectURL(blob);
            cameraRef.current.onload = () => {
              URL.revokeObjectURL(imgUrl);
            };
            cameraRef.current.onerror = () => {
              console.error("Failed to load image");
            };
            cameraRef.current.src = imgUrl;
          }
        } catch (error) {
          console.error("Error Parsing frame:", error);
        }
      };
    }
    if (!isRecording && cameraRef.current) {
      cameraRef.current.src = '';
    }
    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [isRecording]);

  useEffect(() => {
    if (isRecording && !isSuccess) {
      const predict = setInterval(async () => {
        predictGesture()
          .then(response => {
            if(response) {
              setCheck1(response.check1);
              if (response.check1 && response.check2) {
                setIsSuccess(true);
              }
            }
          })
      }, 1000);
      return () => {
        clearInterval(predict);
      }
    }
  }, [isRecording, isSuccess]);

  return (
    <PageFirst header={header}>
      <div>
        {isRecording ? (
          <div style={{display: 'flex'}}>
            <Button onClick={closeCamera} disabled={!isRecording}>
              <StopCircle className="mr-2 h-4 w-4" /> 종료
            </Button>
          </div>
        ) : (
          <Button onClick={openCamera} disabled={isRecording}>
            <Camera className="mr-2 h-4 w-4" /> 카메라 시작
          </Button>
        )}
        <div style={{display: 'flex'}}>
          <p style={{paddingRight: '10px'}}>아이와 함께하는 2인 동작 게임</p>
        </div>
      </div>
      <Card>
        <CardContent>
          <div className="aspect-video bg-gray-200 mb-4">
            {isRecording && (
              <div>
                <img ref={cameraRef} alt="Camera Stream" 
                  style={{width: '100%', height: 'auto', objectFit: 'cover',
                    border: check1 ? '4px solid #2FED28' : '2px solid gray'
                  }} />
                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                  <p style={{marginRight: '10px'}}>'{corLabel ? corLabel : '-'}'</p>
                  <p onClick={againCorLabel}><LoopIcon /></p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      {isRecording && (
        <div>
          <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <p onClick={showHint} style={{color: 'blue', textDecoration: 'underline'}}>힌트</p>
          </div>
          {isHint && (
            <Card>
              <CardContent>
                <div className="aspect-video bg-gray-200 mb-4">
                  <img src={hintImage} alt="Hint" 
                    style={{width: '100%', height: 'auto', objectFit: 'cover'}} />
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
      {isSuccess && 
        <MSuccessGesture againCorLabel={againCorLabel} closeCamera={closeCamera} />
      }
      {isLoading && 
        <Modal>
          <p>잠시만 기다려주세요.</p>
        </Modal>
      }
    </PageFirst>
  );
};

export default Gesture;