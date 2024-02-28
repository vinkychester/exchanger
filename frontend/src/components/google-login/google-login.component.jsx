import React from "react";
import { useHistory } from "react-router-dom";
import { GoogleLogin } from "react-google-login";
import { useApolloClient } from "@apollo/react-hooks";
import axios from "axios";

import jwt_decode from "jwt-decode";
import { closableNotificationWithClick } from "../notification/closable-notification-with-click.component";

import { StyledButton } from "../styles/styled-button";

const GoogleAuth = ({ setLoginResponse, setLoading }) => {
  let history = useHistory();
  const client = useApolloClient();

  const responseGoogle = (response) => {
    if (response.error) {
      setLoading(false);
      closableNotificationWithClick("Ошибочный вход", "info");
      return;
    }
    const { tokenId, profileObj: { email } } = response;
    setLoading(true);
    axios.post("/api/google_check", { tokenId, email }, {
        headers: {
          "Content-Type": "application/json"
        }
      }
    ).then((response) => {
      if (!response.data.token && response.status === 200) {
        setLoginResponse(response);
      } else if (response.status === 200) {
        const { token } = response.data;
        const { id, role } = jwt_decode(token);
        client.writeData({ data: { isLoggedIn: true, userId: id, userRole: role } });
        localStorage.setItem("token", token);
        history.push("/panel/requisitions");
      } else if (response.status === 201) {
        closableNotificationWithClick("Обратитесь к администрации сайта для получения кода безопасности", "error");
      }
      setLoading(false);
    }).catch(error => {
      if (error.response.status === 403) {
        closableNotificationWithClick(error.response.data.detail, "error");
      }
      if (error.response.status === 409) {
        closableNotificationWithClick("Вы заблокированы. Обратитесь к администрации сайта для разблокировки", "error");
      }
      setLoading(false);
    });
  };

  return (
    <GoogleLogin
      clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
      render={renderProps => (
        <StyledButton
          onClick={renderProps.onClick}
          disabled={renderProps.disabled}
          type="button"
          figure="circle"
          className="login-form__google"
        >
          <span className="icon-google" />
        </StyledButton>
      )}
      onSuccess={responseGoogle}
      onFailure={responseGoogle}
      cookiePolicy={"single_host_origin"}
    />
  );
};

export default GoogleAuth;
