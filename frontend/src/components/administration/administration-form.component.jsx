import React, { useContext, useState } from "react";
import { useMutation } from "@apollo/react-hooks";

import DelayInputComponent from "../input-group/delay-input-group";

import { GET_USER_BY_DISCR } from "../../graphql/queries/user.query";

import { parseApiErrors } from "../../utils/response";
import FragmentSpinner from "../spinner/fragment-spinner.component";

import { StyledFormWrapper, StyledHiddenForm, StyledHiddenFormAction } from "../styles/styled-form";
import { StyledButton } from "../styles/styled-button";
import { StyledLoadingWrapper } from "../spinner/styled-spinner";
import { PaginationContext } from "./administration.container";

const AdministrationForm = ({ discr, mutation }) => {
  const [hide, setHide] = useState(true);
  const [errors, setErrors] = useState([]);
  const [{ firstname, lastname, email }, setAdministrationDetails] = useState({
    firstname: "",
    lastname: "",
    email: ""
  });

  const paginationContext = useContext(PaginationContext);

  const [createAdministration, { loading }] = useMutation(mutation, {
    refetchQueries: [{
      query: GET_USER_BY_DISCR,
      variables: { discr, page: paginationContext.currentPage, itemsPerPage: paginationContext.itemsPerPage }
    }],
    onCompleted: () => {
      setAdministrationDetails({ firstname: "", lastname: "", email: "" });
      setErrors([]);
    },
    onError: ({ graphQLErrors }) => setErrors(parseApiErrors(graphQLErrors)),
  });

  const handleChange = event => {
    const { name, value } = event.target;
    setAdministrationDetails((prevState) => ({
      ...prevState,
      [name]: value.trim()
    }));
  };

  const handleSubmit = event => {
    event.preventDefault();
    createAdministration({ variables: { firstname, lastname, email } });
  };

  const showForm = () => {
    hide ? setHide(false) : setHide(true);
  };

  return (
    <StyledHiddenForm>
      <StyledHiddenFormAction>
        <StyledButton type="button" color="main" onClick={showForm}>
          Добавить {discr}
        </StyledButton>
      </StyledHiddenFormAction>
      <StyledLoadingWrapper className="loading-create-user-form">
        {loading && <FragmentSpinner position="center"/>}
        <StyledFormWrapper onSubmit={handleSubmit} className={`create-user-form ${loading && "loading"}`} hide={hide}>
          <DelayInputComponent
            type="text"
            name="firstname"
            label="Имя"
            value={firstname}
            debounceTimeout={600}
            handleChange={handleChange}
            errorMessage={errors.firstname}
            required
          />
          <DelayInputComponent
            type="text"
            name="lastname"
            label="Фамилия"
            value={lastname}
            debounceTimeout={600}
            handleChange={handleChange}
            errorMessage={errors.lastname}
            required
          />
          <DelayInputComponent
            type="email"
            name="email"
            label="E-mail"
            value={email}
            debounceTimeout={600}
            handleChange={handleChange}
            errorMessage={errors.email}
            required
          />
          <StyledButton disabled={loading} type="submit" color="main">
            Создать
          </StyledButton>
        </StyledFormWrapper>
      </StyledLoadingWrapper>
    </StyledHiddenForm>
  );
};

export default AdministrationForm;
