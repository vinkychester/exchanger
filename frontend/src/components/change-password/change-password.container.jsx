import React, { useState } from "react";
import { useParams } from "react-router-dom";
import Title from "../title/title.component";
import { StyledLoadingWrapper } from "../spinner/styled-spinner";
import FragmentSpinner from "../spinner/fragment-spinner.component";
import { useMutation } from "@apollo/react-hooks";
import { CHANGE_PASSWORD } from "../../graphql/mutations/user.mutation";
import { parseApiErrors } from "../../utils/response";
import AlertMessage from "../alert/alert.component";
import DelayInputComponent from "../input-group/delay-input-group";
import { closableNotificationWithClick } from "../notification/closable-notification-with-click.component";

import { StyledFormTitle, StyledFormWrapper } from "../styles/styled-form";
import { StyledButton } from "../styles/styled-button";

const ChangePasswordContainer = () => {

  const [{ token }, setUrlParams] = useState(useParams());
  const [errorMessage, setErrorMessage] = useState("");
  const [errors, setErrors] = useState([]);
  const [{ newPassword, newRetypedPassword }, setPasswordDetails] = useState({
    newPassword: "",
    newRetypedPassword: ""
  });

  const [changePassword, { loading }] = useMutation(CHANGE_PASSWORD, {
    onCompleted: () => {
      setPasswordDetails({ newPassword: "", newRetypedPassword: "" });
      setErrors([]);
      setErrorMessage("");
      closableNotificationWithClick("Вы успешно изменили свой пароль", "success");
    },
    onError: ({ graphQLErrors }) => {
      let error = parseApiErrors(graphQLErrors);
      error.internal ? closableNotificationWithClick(error.internal, "error") : setErrors(parseApiErrors(graphQLErrors));
    }
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    changePassword({
      variables: { token, newPassword, newRetypedPassword }
    });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setPasswordDetails((prevState) => ({
      ...prevState,
      [name]: value.trim()
    }));
  };

  if (!token) return <AlertMessage type="warning" message="Невалидный токен" />;

  return (
    <>
      <Title as="h1" title="Новый пароль" description="Помощь" />
      <StyledLoadingWrapper className="loading-change-password-form">
        {loading && <FragmentSpinner position="center" />}
        <StyledFormWrapper
          className={`change-password-form ${loading && "loading"}`}
          onSubmit={handleSubmit}
        >
          <StyledFormTitle as="h3" className="change-password-form__title">
            Введите новый пароль
          </StyledFormTitle>
          <DelayInputComponent
            id="newPassword"
            type="password"
            name="newPassword"
            label="Новый пароль"
            value={newPassword}
            handleChange={handleChange}
            debounceTimeout={600}
            errorMessage={errors.newPassword}
            required
          />
          <DelayInputComponent
            id="newRetypedPassword"
            type="password"
            name="newRetypedPassword"
            label="Подтвердите новый пароль"
            value={newRetypedPassword}
            handleChange={handleChange}
            debounceTimeout={600}
            errorMessage={errors.newRetypedPassword}
            required
          />
          <div className="change-password-form__footer">
            <StyledButton color="main" type="submit" disabled={!token}>
              Изменить пароль
            </StyledButton>
          </div>
        </StyledFormWrapper>
      </StyledLoadingWrapper>
    </>
  );
};

export default ChangePasswordContainer;
