import React from 'react';
import Modal from '../../Modal';
import '../../feat_diary/css/modal/ModalTwoButton.css';

const MSuccessGesture = (props) => {
  const againCorLabel = props.againCorLabel;
  const closeCamera = props.closeCamera;

  return (
    <Modal>
      <p style={{fontWeight:"normal"}}>동작 성공!</p>
      <div className="modalTwoButton">
        <button className="yes" onClick={againCorLabel}>다시 하기</button>
        <button className="no" onClick={closeCamera}>결과 보기</button>
      </div>
    </Modal>
  );
}

export default MSuccessGesture;