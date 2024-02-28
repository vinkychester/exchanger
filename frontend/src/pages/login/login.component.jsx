import React, { useState } from "react";
import { NavLink, useHistory } from "react-router-dom";
import { useApolloClient } from "@apollo/react-hooks";
import { Helmet } from "react-helmet-async";
import axios from "axios";
import jwt_decode from "jwt-decode";

import Title from "../../components/title/title.component";
import DelayInputComponent from "../../components/input-group/delay-input-group";
import GoogleAuth from "../../components/google-login/google-login.component";
import FragmentSpinner from "../../components/spinner/fragment-spinner.component";
import TwoFactorAuthForm from "../../components/google-login/two-factor-auth-form.component";

import { StyledContainer } from "../../components/styles/styled-container";
import { StyledFormText, StyledFormTitle, StyledFormWrapper } from "../../components/styles/styled-form";
import { StyledButton } from "../../components/styles/styled-button";
import { StyledLoadingWrapper } from "../../components/spinner/styled-spinner";
import { StyledLoginWrapper } from "./styled-login";

import { closableNotificationWithClick } from "../../components/notification/closable-notification-with-click.component";

const LoginPage = () => {
  let history = useHistory();
  const client = useApolloClient();
  
  const [code, setCode] = useState("");
  const [twoAuthToken, setTwoAuthToken] = useState();
  const [usernameDisabled, setUsernameDisabled] = useState(false);
  const [userCredentials, setCredentials] = useState({ username: "", password: "" });
  const [loginResponse, setLoginResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const submitLoginForm = (url, data) => {
    axios.post(url, data).then((response) => {
      if (response.status === 200) {
        const { token } = response.data;
        const { id, role } = jwt_decode(token);
        localStorage.setItem("token", token);
        client.writeData({ data: { isLoggedIn: true, userId: id, userRole: role } });
        if (localStorage.getItem('first_login/api/clients/' + id)) {
          history.push("/panel/account");
        } else {
          history.push("/panel/requisitions");
        }
      }
      setLoading(false);
    }).catch((error) => {
      if (error.response && error.response.status === 403) {
        closableNotificationWithClick(error.response.data.detail, "error");
      }
      if (error.response && error.response.status === 401) {
        closableNotificationWithClick("Неверный логин или пароль", "error");
      }
      if (error.response && error.response.status === 407) {
        setUsernameDisabled(true);
        const errorData = error.response.data;
        setTwoAuthToken(errorData.tokenTwoAuth);
      }
      setLoading(false);
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { username, password, code } = userCredentials;
    setLoading(true);
    if (!twoAuthToken) {
      submitLoginForm("/api/login_check", { username, password });
    } else {
      submitLoginForm("/api/login_check", { username, password, token: twoAuthToken, code });
    }
  };

  const handleChange = (event) => {
    const { value, name } = event.target;
    setCredentials({ ...userCredentials, [name]: value.trim() });
  };

  const { username, password } = userCredentials;

  return (
    <StyledContainer>
      <Helmet>
        <title>Авторизация - Coin24</title>
        <meta
          name="description"
          content="Если Вы уже являетесь зарегистрированным пользователем нашего сайта, выполните вход, используя форму авторизации"
        />
      </Helmet>
      <StyledLoginWrapper>
        <Title
          as="h1"
          title="Авторизация"
          description="Вход"
        />
        <StyledLoadingWrapper className="loading-login-form">
          {loading && <FragmentSpinner position="center" />}
          {loginResponse !== null ?
            <TwoFactorAuthForm loading={loading} setLoading={setLoading} loginResponse={loginResponse} /> :
            <StyledFormWrapper
              className={`login-form ${loading && "loading"}`}
              onSubmit={handleSubmit}
            >
              <StyledFormTitle as="h3"> Добро пожаловать! </StyledFormTitle>
              <GoogleAuth
                setLoading={setLoading}
                setLoginResponse={setLoginResponse}
              />
              <StyledFormText as="p"> или используйте свой e-mail </StyledFormText>
              <DelayInputComponent
                id="login"
                type="text"
                label="E-mail"
                name="username"
                value={username}
                autoComplete="off"
                debounceTimeout={600}
                handleChange={handleChange}
                required
                disabled={usernameDisabled}
              />
              <DelayInputComponent
                id="password"
                type="password"
                name="password"
                label="Пароль"
                value={password}
                autoComplete="off"
                debounceTimeout={600}
                handleChange={handleChange}
                required
                disabled={usernameDisabled}
              />
              {twoAuthToken &&
              <DelayInputComponent
                id="code"
                type="code"
                name="code"
                label="Код подтверждения"
                value={code}
                autoComplete="off"
                debounceTimeout={600}
                handleChange={handleChange}
                required
              />}
              <StyledFormText
                as="p"
                className="login-form__user-agree"
              >
                Нажимая кнопку "Вход", Вы подтверждаете свое
                согласие с{" "}
                <NavLink
                  className="default-link"
                  to="/useterms"
                >
                  правилами использования сервиса
                </NavLink>
                .
              </StyledFormText>
              <div className="login-form__footer">
                <StyledButton
                  className="login-form__button"
                  as={NavLink}
                  to="/registration"
                >
                  Региcтрация
                </StyledButton>
                <StyledButton
                  className="login-form__button"
                  color="main"
                  type="submit"
                >
                  Вход
                </StyledButton>
              </div>
              <NavLink
                className="default-link login-form__forgot-password"
                to="/forgot-password"
              >
                Забыли пароль?
              </NavLink>
            </StyledFormWrapper>
          }
        </StyledLoadingWrapper>
      </StyledLoginWrapper>
    </StyledContainer>
  );
};

export default React.memo(LoginPage);
