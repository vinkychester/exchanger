import React from "react";
import Dialog from "rc-dialog";

import "rc-dialog/assets/index.css";

const ModalWindow = ({ visible, setVisible, title, content }) => {

  const onClose = () => {
    setVisible(false);
  };

  return (
    <Dialog
      visible={visible}
      wrapClassName="rc-modal-center"
      onClose={onClose}
      animation="zoom"
      maskAnimation="fade"
      title={title}
      forceRender={false}
      className="default-modal"
    >
      {content}
    </Dialog>
  );
};

export default ModalWindow;