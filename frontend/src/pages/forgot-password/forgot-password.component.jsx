import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useMutation } from "@apollo/react-hooks";

import DelayInputComponent from "../../components/input-group/delay-input-group";
import Title from '../../components/title/title.component';
import FragmentSpinner from '../../components/spinner/fragment-spinner.component';

import { FORGOT_PASSWORD } from "../../graphql/mutations/user.mutation";

import { closableNotificationWithClick } from "../../components/notification/closable-notification-with-click.component";
import { parseApiErrors } from "../../utils/response";

import { StyledContainer } from '../../components/styles/styled-container';
import { StyledFormText, StyledFormTitle, StyledFormWrapper } from '../../components/styles/styled-form';
import { StyledButton } from '../../components/styles/styled-button';
import { StyledForgotPasswordWrapper } from './styled-forgot-password';
import { StyledLoadingWrapper } from '../../components/spinner/styled-spinner';


const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSuccess, setSuccess] = useState(false);

  const [forgotPassword, {loading}] = useMutation(FORGOT_PASSWORD, {
    onCompleted: () => {
      setSuccess(!isSuccess);
      setEmail("");
      setErrorMessage("");
      closableNotificationWithClick(
        'Мы отправим вам письмо с инструкциями для восстановления. Пожалуйста, проверьте свою электронную почту.',
        'success'
      );
    },
    onError: ({graphQLErrors}) => setErrorMessage(parseApiErrors(graphQLErrors)),
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    forgotPassword({variables: {email}});
  };

  return (
    <StyledContainer>
      <StyledForgotPasswordWrapper>
        <Title as="h1" title="Восстановление пароля" description="Помощь"/>
        <StyledLoadingWrapper className="loading-forgot-password-form">
          {loading && <FragmentSpinner position="center"/>}
          <StyledFormWrapper className={`forgot-password-form ${loading && 'loading'}`} onSubmit={handleSubmit}>
            <StyledFormTitle as="h3" className="forgot-password-form__title">
              Забыли пароль?
            </StyledFormTitle>
            <StyledFormText as="p" className="forgot-password-form__text">
              Пожалуйста, введите адрес электронной почты, который вы использовали для создания учетной записи. Мы отправим
              вам электронное письмо со ссылкой для сброса пароля.
            </StyledFormText>
            <DelayInputComponent
              id="email"
              type="email"
              name="email"
              label="E-mail"
              value={email}
              handleChange={(event) => setEmail(event.target.value.trim())}
              debounceTimeout={600}
              errorMessage={errorMessage.internal}
              required
            />
            <div className="forgot-password-form__footer">
              <StyledButton color="main" type="submit">
                Подтвердить
              </StyledButton>
            </div>
            <NavLink className="default-link forgot-password-form__account" to="/login">
              У меня уже есть аккаунт
            </NavLink>
          </StyledFormWrapper>
        </StyledLoadingWrapper>
      </StyledForgotPasswordWrapper>
    </StyledContainer>
  );
};

export default React.memo(ForgotPasswordPage);
