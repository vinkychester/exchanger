import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useMutation } from "@apollo/react-hooks";
import { Helmet } from "react-helmet-async";

import Title from "../../components/title/title.component";
import DelayInputComponent from "../../components/input-group/delay-input-group";
import FragmentSpinner from "../../components/spinner/fragment-spinner.component";
import GoogleAuth from "../../components/google-login/google-login.component";
import TwoFactorAuthForm from "../../components/google-login/two-factor-auth-form.component";

import { StyledContainer } from "../../components/styles/styled-container";
import { StyledRegistrationWrapper } from "./styled-registration";
import { StyledFormText, StyledFormTitle, StyledFormWrapper } from "../../components/styles/styled-form";
import { StyledButton } from "../../components/styles/styled-button";
import { StyledLoadingWrapper } from "../../components/spinner/styled-spinner";

import { CREATE_CLIENT } from "../../graphql/mutations/user.mutation";
import { parseApiErrors } from "../../utils/response";
import { closableNotificationWithClick } from "../../components/notification/closable-notification-with-click.component";

const RegistrationPage = () => {
  const [errors, setErrors] = useState([]);
  const [{ firstname, lastname, email }, setClientDetails] = useState({ firstname: "", lastname: "", email: "" });

  const [loginResponse, setLoginResponse] = useState(null);
  const [load, setLoad] = useState(false);

  const [createClient, { loading }] = useMutation(CREATE_CLIENT, {
    onCompleted: (data) => {
      setClientDetails({ firstname: "", lastname: "", email: "" });
      setErrors([]);
      closableNotificationWithClick(
        "Вы успешно зарегистрированы. Проверьте почту для подтверждения аккаунта.",
        "success"
      );
    },
    onError: ({ graphQLErrors }) => setErrors(parseApiErrors(graphQLErrors))
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setClientDetails((prevState) => ({ ...prevState, [name]: value.trim() }));
  };

  const onSubmit = (event) => {
    event.preventDefault();
    createClient({ variables: { firstname, lastname, email } });
  };

  return (
    <StyledContainer>
      <Helmet>
        <title>Регистрация - Coin24</title>
        <meta
          name="description"
          content="Регистрируйтесь на нашем сайте и получайте бонусы за новых привлеченных пользователей"
        />
      </Helmet>
      <StyledRegistrationWrapper>
        <Title as="h1" title="Регистрация" description="Старт" />
        <StyledLoadingWrapper className="loading-registration-form">
          {loading && <FragmentSpinner position="center" />}
          {loginResponse !== null ?
            <TwoFactorAuthForm loading={load} setLoading={setLoad} loginResponse={loginResponse} /> :
            <StyledFormWrapper
              className={`registration-form ${loading && "loading"}`}
              onSubmit={onSubmit}
            >
              <StyledFormTitle as="h3" className="registration-form__title">
                Создать аккаунт
              </StyledFormTitle>
              <DelayInputComponent
                id="firstname"
                type="text"
                label="Имя"
                name="firstname"
                value={firstname}
                handleChange={handleChange}
                debounceTimeout={600}
                errorMessage={errors.firstname}
                required
              />
              <DelayInputComponent
                id="lastname"
                type="text"
                label="Фамилия"
                name="lastname"
                value={lastname}
                handleChange={handleChange}
                debounceTimeout={600}
                errorMessage={errors.lastname}
                required
              />
              <DelayInputComponent
                id="email"
                type="email"
                label="E-mail"
                name="email"
                value={email}
                handleChange={handleChange}
                debounceTimeout={600}
                errorMessage={errors.email}
                required
              />
              <StyledFormText as="p" className="registration-form__user-agree">
                Нажимая кнопку "Зарегистрироваться", Вы подтверждаете свое
                согласие с{" "}
                <NavLink className="default-link" to="/useterms">
                  правилами использования сервиса
                </NavLink>
                .
              </StyledFormText>
              <div className="registration-form__footer">
                <StyledButton
                  className="registration-form__button"
                  as={NavLink}
                  to="/login"
                >
                  Войти
                </StyledButton>
                <StyledButton
                  className="registration-form__button"
                  color="main"
                  type="submit"
                >
                  Зарегистрироваться
                </StyledButton>
              </div>
              <StyledFormText as="p">
                или используйте социальные сети
              </StyledFormText>
              <GoogleAuth
                setLoading={setLoad}
                setLoginResponse={setLoginResponse}
              />
            </StyledFormWrapper>
          }
        </StyledLoadingWrapper>
      </StyledRegistrationWrapper>
    </StyledContainer>
  );
};

export default React.memo(RegistrationPage);
