import React, { useState } from "react";
import { StyledButton } from "../styles/styled-button";
import ModalWindow from "../modal/modal-window";

const Confirmation = ({ question, handler, visible, setVisible }) => {
  const [text, setText] = useState(question);

  const dialog = () => {
    return (
      <>
        <div className="default-modal__body-content">{text}</div>
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
              setVisible(false);
            }}
          >
            Да
          </StyledButton>
        </div>
      </>
    );
  };

  return (
    <>
      {visible && (
        <ModalWindow
          visible={visible}
          setVisible={setVisible}
          title="Внимание!"
          content={dialog()}
        />
      )}
    </>
  );
};

export default Confirmation;
