import React, { useState } from "react";
import { useMutation } from "@apollo/react-hooks";
import jwtDecode from "jwt-decode";

import AlertMessage from "../alert/alert.component";
import FragmentSpinner from "../spinner/fragment-spinner.component";
import DelayInputComponent from "../input-group/delay-input-group";

import { StyledButton } from "../styles/styled-button";
import { StyledChangePassword } from "../../pages/account/styled-account";
import { StyledLoadingWrapper } from "../spinner/styled-spinner";

import { ACCOUNT_CHANGE_PASSWORD } from "../../graphql/mutations/user.mutation";
import { closableNotificationWithClick } from "../notification/closable-notification-with-click.component";
import { parseApiErrors } from "../../utils/response";

const AccountChangePassword = ({ firstLogin, setFirstLogin }) => {
  const [{ id }] = useState(jwtDecode(localStorage.getItem("token")));
  const [errorMessage, setErrorMessage] = useState("");
  const [errors, setErrors] = useState([]);
  const [
    { oldPassword, newPassword, newRetypedPassword },
    setPasswordDetails,
  ] = useState({
    oldPassword: "",
    newPassword: "",
    newRetypedPassword: "",
  });

  const [changePassword, { loading }] = useMutation(ACCOUNT_CHANGE_PASSWORD, {
    onCompleted: () => {
      setPasswordDetails({
        oldPassword: "",
        newPassword: "",
        newRetypedPassword: "",
      });
      setErrors([]);
      setErrorMessage("");
      setFirstLogin(false);
      closableNotificationWithClick(
        "Вы успешно изменили свой пароль",
        "success"
      );
    },
    onError: ({ graphQLErrors }) => {
      let error = parseApiErrors(graphQLErrors);
      error.internal
        ? closableNotificationWithClick(error.internal, "error")
        : setErrors(parseApiErrors(graphQLErrors));
    },
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    changePassword({
      variables: {
        id: "/api/clients/" + id,
        oldPassword,
        newPassword,
        newRetypedPassword,
      },
    });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setPasswordDetails((prevState) => ({
      ...prevState,
      [name]: value.trim(),
    }));
  };

  return (
    <StyledLoadingWrapper>
      {loading && <FragmentSpinner position="center" />}
      {firstLogin && (
        <AlertMessage
          margin="0 0 30px"
          type="warning"
          message="В целях безопасности просим вас изменить пароль"
        />
      )}
      <StyledChangePassword
        className={`change-change-password-form__title ${loading && "loading"}`}
        onSubmit={handleSubmit}
      >
        <div className="change-password-form__group">
          <DelayInputComponent
            id="oldPassword"
            type="password"
            name="oldPassword"
            label="Действующий пароль"
            value={oldPassword}
            handleChange={handleChange}
            debounceTimeout={600}
            errorMessage={errors.oldPassword}
            required
          />
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
          <div className="submit-btn">
            <StyledButton color="main" type="submit">
              Изменить
            </StyledButton>
          </div>
        </div>
        <div className="clear-grid" />
      </StyledChangePassword>
    </StyledLoadingWrapper>
  );
};

export default AccountChangePassword;
