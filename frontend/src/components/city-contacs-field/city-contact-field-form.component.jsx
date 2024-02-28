import React, { useState } from "react";
import { StyledFormWrapper, StyledHiddenForm, StyledHiddenFormAction } from "../styles/styled-form";
import { StyledButton } from "../styles/styled-button";
import { StyledLoadingWrapper } from "../spinner/styled-spinner";
import FragmentSpinner from "../spinner/fragment-spinner.component";
import InputGroupComponent from "../input-group/input-group.component";
import { useMutation } from "@apollo/react-hooks";
import { CREATE_CITY_CONTACT_FIELD } from "../../graphql/mutations/city-contact-field.mutation";
import { GET_CITY_CONTACT_FIELDS_LIST } from "../../graphql/queries/city-contact-filed.query";
import { closableNotificationWithClick } from "../notification/closable-notification-with-click.component";

const CityContactFieldForm = () => {
  const [hide, setHide] = useState(true);
  const [load, setLoad] = useState(false);
  const [name, setName] = useState("");
  const [type, setType] = useState("string");

  const [createCityContactField] = useMutation(CREATE_CITY_CONTACT_FIELD, {
    update: (proxy, mutationResult) => {
      const data = proxy.readQuery({
        query: GET_CITY_CONTACT_FIELDS_LIST
      });
      setLoad(false);
      closableNotificationWithClick("Мессенджер добавлен", "success");
      proxy.writeQuery({
        query: GET_CITY_CONTACT_FIELDS_LIST,
        data: {
          cityContactFields: [...data.cityContactFields, mutationResult?.data?.createCityContactField?.cityContactField]
        }
      });
    },
    onError: error => {
      closableNotificationWithClick(
        `${error.graphQLErrors[0].message}`,
        "error"
      );
    }
  });

  const handleChangeInput = (event) => {
    setName(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoad(true);
    createCityContactField({
      variables: {
        input: {
          name,
          type
        }
      }
    });
    setName("");
  };

  const showForm = () => {
    hide ? setHide(false) : setHide(true);
  };

  return (
    <StyledHiddenForm className="hidden-add-messenger-form">
      <StyledHiddenFormAction>
        <StyledButton
          type="button"
          color="main"
          onClick={showForm}
        >
          Добавить мессенджер
        </StyledButton>
      </StyledHiddenFormAction>

      <StyledLoadingWrapper className="loading-add-messenger-form">
        {load && <FragmentSpinner position="center" />}
        <StyledFormWrapper
          onSubmit={handleSubmit}
          className={`add-messenger-form ${load && "loading"}`}
          hide={hide}
        >
          <InputGroupComponent
            handleChange={handleChangeInput}
            value={name}
            name="contact-city-field"
            type="string"
            label="Мессенджер"
            required="required"
          />
          <StyledButton
            type="submit"
            color="success"
            weight="normal"
          >
            Сохранить
          </StyledButton>
        </StyledFormWrapper>
      </StyledLoadingWrapper>
    </StyledHiddenForm>
  );
};

export default CityContactFieldForm;