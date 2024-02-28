import React, { useEffect, useState } from "react";
import { NavLink, useHistory } from "react-router-dom";
import jwt_decode from "jwt-decode";
import axios from "axios";
import { closableNotificationWithClick } from "../notification/closable-notification-with-click.component";
import InputGroupComponent from "../input-group/input-group.component";

import { StyledFormText, StyledFormTitle, StyledFormWrapper } from "../styles/styled-form";
import { StyledButton } from "../styles/styled-button";

import client from "../../client";

const TwoFactorAuthForm = ({ loginResponse, loading, setLoading }) => {
  const history = useHistory();
  const [code, setCode] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
    document.getElementById("google-auth").focus();
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);
    const data = {
      id: loginResponse.data.id,
      code: code
    };
    axios.post("api/google_two_factor_check", data, {
      headers: {
        "Content-Type": "application/json"
      }
    }).then(response => {
      if (response.status === 200) {
        const { token, refresh_token } = response.data;
        const { id, role, managerCity } = jwt_decode(token);
        if (role === 'manager') {
          localStorage.setItem("refresh_token", refresh_token);
        }
        localStorage.setItem("token", token);
        client.writeData({ data: { isLoggedIn: true, userId: id, userRole: role, managerCity } });
        if (role === "seo") {
          history.push("/panel/news");
        } else {
          history.push("/panel/requisitions");
        }
      }
      setLoading(false);
    }).catch(error => {
      if (error.response.status === 403) {
        closableNotificationWithClick("Неверный код подтверждения", "error");
        //setTimeout(() => window.location.href = "/login", 2000);
      }
      if (error.response.status === 409) {
        closableNotificationWithClick("Вы заблокированы. Обратитесь к администрации сайта для разблокировки", "error");
      }
      setLoading(false);
    });
  };

  const onChangeInput = ({ target }) => {
    setCode(target.value.replace(/\D/, ""));
  };

  return (
    <StyledFormWrapper
      onSubmit={handleSubmit}
      className={`two-factor-form ${loading && "loading"}`}
    >
      <StyledFormTitle as="h3" className="two-factor-form__title"> Подтверждение личности! </StyledFormTitle>
      <InputGroupComponent
        id="google-auth"
        type="text"
        autocomplete="off"
        label="Введите шестизначный код"
        value={code}
        handleChange={onChangeInput}
        className="two-factor-form__input"
        maxLength="6"
      />
      <div className="two-factor-form__footer">
        <StyledButton
          type="submit"
          color="main"
        >
          Подтвердить
        </StyledButton>
      </div>
      <StyledFormText as="p">
        Потеряли код безопасности? <br /> Свяжитесь со службой <NavLink
        to="/contacts"
        className="default-link"
      >поддеркжи</NavLink>.
      </StyledFormText>
    </StyledFormWrapper>
  );
};

export default TwoFactorAuthForm;
