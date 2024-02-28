import React, { useEffect, useState } from "react";
import { useMutation } from "@apollo/react-hooks";
import { NavLink } from "react-router-dom";
import { useHistory } from "react-router-dom";


import { StyledButton } from "../../components/styles/styled-button";

import { CONFIRM_EMAIL } from "../../graphql/mutations/user.mutation";

import { parseApiErrors } from "../../utils/response";

import { StyledContainer } from '../../components/styles/styled-container';
import Title from '../../components/title/title.component';
import AlertMessage from '../../components/alert/alert.component';
import PageSpinner from "../../components/spinner/page-spinner.component";

const EmailConfirmPage = () => {
  let history = useHistory();
  let regex = /\?token=(\w+)/;

  const [errorMessage, setErrorMessage] = useState("");
  const [isSuccessMessage, setSuccessMessage] = useState(false);

  const [confirmEmail, { loading }] = useMutation(CONFIRM_EMAIL, {
    onCompleted: (data) => {
      setSuccessMessage(!isSuccessMessage);
      setErrorMessage("");
      localStorage.setItem("first_login" + data.confirmationMutationClient.client.id, "first_login");
    },
    onError: ({ graphQLErrors }) => setErrorMessage(parseApiErrors(graphQLErrors))
  });

  useEffect(() => {
    const { search } = history.location;
    
    if (null === search.match(regex)) {
      history.push("/");
    } else {
      confirmEmail({ variables: { token: search.match(regex)[1] } });
    }
    
  }, []);

  if (loading) return <PageSpinner/>;

  return (
    <StyledContainer>
      <Title as="h1" title="Подтверждение аккаунта"/>
      {errorMessage && <AlertMessage type="error" message={errorMessage.internal} margin="0 0 20px"/>}
      {isSuccessMessage ? <AlertMessage type="success" message="Аккаунт успешно подтвержден" margin="0 0 20px"/> : null}
      <StyledButton as={NavLink} to="/login">
        Войти
      </StyledButton>
    </StyledContainer>
  );
};

export default React.memo(EmailConfirmPage);
