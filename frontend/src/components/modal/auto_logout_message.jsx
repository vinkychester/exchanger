import React, { useState } from "react";
import Dialog from "rc-dialog";

import "rc-dialog/assets/index.css";
import { StyledButton } from "../styles/styled-button";
import { useMutation } from "@apollo/react-hooks";
import { CHANGE_ONLINE } from "../../graphql/mutations/user.mutation";
import { useIdleTimer } from "react-idle-timer";

const AutoLogoutMessage = ({ title, userId, userRole }) => {

  let role = "manager";

  const [setIsOnline] = useMutation(CHANGE_ONLINE);
  const [visible, setVisible] = useState(false);

  const handleOnIdle = event => {
    if (userId) {
      if (userRole === role) {
        setIsOnline({ variables: { id: "/api/managers/" + userId, isOnline: false } });
      }
      localStorage.removeItem("token");
      setVisible(true);
    }
  };

  const { getRemainingTime, getLastActiveTime } = useIdleTimer({
    timeout: 1000 * 60 * 60,
    onIdle: handleOnIdle,
    debounce: 500
  });

  const modalContent = () => {
    const yes = () => {
      setVisible(false);
      window.location.href = "/";
    };

    const style = {
      textAlign: 'justify'
    }

    return (
      <>
        <div className="default-modal__body-content">
          <p style={style}>
            В целях безопасности и сохранности Вашего аккаунта, был произведен
            автоматический выход из Вашей учётной записи, в связи с бездействием
            на сайте.
          </p>
          <p style={style}>
            Для продолжения работы, произведите повторный вход.
          </p>
        </div>
        <div className="default-modal__body-footer">
          <StyledButton color="main" onClick={yes} weight="normal">
            Ok
          </StyledButton>
        </div>
      </>
    );
  };

  return (
    <Dialog
      visible={visible}
      wrapClassName="rc-modal-center"
      closeIcon={false}
      closable={false}
      animation="zoom"
      maskAnimation="fade"
      title={title}
      className="default-modal"
    >
      {modalContent()}
    </Dialog>
  );
};

export default AutoLogoutMessage;