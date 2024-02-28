import React, { useState } from "react";
import FragmentSpinner from "../spinner/fragment-spinner.component";
import Dialog from "rc-dialog";
import "rc-dialog/assets/index.css";

import { StyledButton } from "../styles/styled-button";

const DialogModal = ({ visible, setVisible, message, handler, title, loading }) => {
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
      className={`default-modal ${loading && 'default-modal_loading'}`}
    >
      {loading && <FragmentSpinner position="center" />}
      <div className="default-modal__body-content">{message}</div>
      <div className="default-modal__body-footer">
        <StyledButton
          color="danger"
          weight="normal"
          onClick={() => {
            setVisible(false);
          }}
        >
          Нет
        </StyledButton>
        <StyledButton
          color="success"
          weight="normal"
          onClick={() => {
            handler();
          }}
        >
          Да
        </StyledButton>
      </div>
    </Dialog>
  );
};

export default DialogModal;
