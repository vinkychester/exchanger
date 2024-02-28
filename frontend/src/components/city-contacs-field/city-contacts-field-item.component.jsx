import React, { useState } from "react";
import { useMutation } from "@apollo/react-hooks";
import { StyledBlockText, StyledBlockTitle } from "../styles/styled-info-block";
import DelayInputComponent from "../input-group/delay-input-group";
import { getID } from "../../utils/calculator.utils";
import {
  DELETE_CITY_CONTACT_FIELD,
  UPDATE_CITY_CONTACT_FIELD
} from "../../graphql/mutations/city-contact-field.mutation";
import { StyledButton } from "../styles/styled-button";
import Confirmation from "../confirmation/confirmation";
import { GET_CITY_CONTACT_FIELDS_LIST } from "../../graphql/queries/city-contact-filed.query";
import { StyledCol, StyledRow } from "../styles/styled-table";

const CityContactsFieldItem = ({ field }) => {
  const [name, setName] = useState(field?.name);
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);

  const [updateCityContactField] = useMutation(UPDATE_CITY_CONTACT_FIELD);
  const [deleteCityContactField] = useMutation(DELETE_CITY_CONTACT_FIELD, {
    update: (proxy, mutationResult) => {
      const data = proxy.readQuery({
        query: GET_CITY_CONTACT_FIELDS_LIST
      });
      proxy.writeQuery({
        query: GET_CITY_CONTACT_FIELDS_LIST,
        data: {
          cityContactFields: [...data.cityContactFields.filter(
            cityContactField => cityContactField.id !== mutationResult.data.deleteCityContactField.cityContactField.id
          )]
        }
      });
    }
  });

  const handleChangeInput = (event) => {
    setName(event.target.value);
    updateCityContactField({
      variables: {
        input: {
          id: field.id,
          name: event.target.value
        }
      }
    });
  };

  const handleDeleteField = () => {
    deleteCityContactField({
      variables: {
        id: field.id
      }
    });
  };

  return (
    <>
      {deleteConfirmation && <Confirmation
        question={"Вы действительно хотите удалить это поле?"}
        handler={handleDeleteField}
        visible={deleteConfirmation}
        setVisible={setDeleteConfirmation}
      />}
      <StyledRow col="2" className="messenger-table__row">
        <StyledCol data-title="Мессенджер">
          <DelayInputComponent
            minLength={2}
            id={`${getID(field.id)}`}
            type={"text"}
            value={name}
            debounceTimeout={600}
            onChange={handleChangeInput}
          />
        </StyledCol>
        <StyledCol data-title="Действие">
          <StyledButton
            color="danger"
            onClick={() => setDeleteConfirmation(true)}
            weight="normal"
          >
            Удалить
          </StyledButton>
        </StyledCol>
      </StyledRow>
    </>
  );
};

export default CityContactsFieldItem;