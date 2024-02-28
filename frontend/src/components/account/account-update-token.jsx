import React from "react";
import axios from "axios";
import jwt_decode from "jwt-decode";
import client from "../../client";
import { closableNotificationWithClick } from "../notification/closable-notification-with-click.component";

import { StyledUpdateTokenBtn } from "../../pages/account/styled-account";

const AccountUpdateToken = () => {

  const updateToken = () => {

    const data = {
      refresh_token: localStorage.getItem("refresh_token")
    };
    axios.post("/api/token/refresh", data, {
      headers: {
        "Content-Type": "application/json"
      }
    }).then(response => {
      if (response.status === 200) {
        const { token, refresh_token } = response.data;
        const { id, role, managerCity } = jwt_decode(token);
        localStorage.setItem("refresh_token", refresh_token);
        localStorage.setItem("token", token);
        client.writeData({ data: { isLoggedIn: true, userId: id, userRole: role, managerCity } });
        closableNotificationWithClick("Токен успешно обновлен", "success");
      }
    }).catch(error => {
      if (error.response.status === 401) {
        closableNotificationWithClick("Токен не обновлен. Переавторизуйтесь", "error");
      }
    });
  };

  return (
    <StyledUpdateTokenBtn
      onClick={updateToken}
    >
      Обновить токен
    </StyledUpdateTokenBtn>
  );
};

export default AccountUpdateToken;