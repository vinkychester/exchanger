import React, { useState } from "react";
import { useMutation, useQuery } from "@apollo/react-hooks";
import { StyledButton } from "../styles/styled-button";
import Confirmation from "../confirmation/confirmation";
import { StyledCol, StyledRow } from "../styles/styled-table";
import { DELETE_CITY_DESCRIPTION, UPDATE_CITY_DESCRIPTION } from "../../graphql/mutations/city-description.mutation";
import Checkbox from "rc-checkbox";
import { GET_CITIES_DESCRIPTION } from "../../graphql/queries/cities-description.query";
import { NavLink } from "react-router-dom";
import { getID } from "../../utils/calculator.utils";
import ReactHtmlParser from "react-html-parser";

const CityDetailsItem = ({ cityDescription }) => {
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  const [publishConfirmation, setPublishConfirmation] = useState(false);
  const [isPublish, setIsPublish] = useState(cityDescription?.isPublish ?? null);

  const [updateCityDescription] = useMutation(UPDATE_CITY_DESCRIPTION);
  const [deleteCityDescription] = useMutation(DELETE_CITY_DESCRIPTION, {
    update: (proxy, mutationResult) => {
      const data = proxy.readQuery({
        query: GET_CITIES_DESCRIPTION
      });
      proxy.writeQuery({
        query: GET_CITIES_DESCRIPTION,
        data: {
          cityDescriptions: [...data.cityDescriptions.filter(
            cityContactField => cityContactField.id !== mutationResult.data.deleteCityDescription.cityDescription.id
          )]
        }
      });
    }
  });

  const handleChangeInPublic = () => {
    setIsPublish(!isPublish);
    updateCityDescription({
      variables: {
        input: {
          id: cityDescription.id,
          isPublish: !cityDescription.isPublish
        }
      }
    });
  };

  const handleDeleteField = () => {
    deleteCityDescription({
      variables: {
        id: cityDescription.id
      }
    });
  };

  return (
    <React.Fragment>
      {publishConfirmation && <Confirmation
        handler={handleChangeInPublic}
        question={"Вы действительно хотите изменить значение публикации для описания города?"}
        visible={publishConfirmation}
        setVisible={setPublishConfirmation}
      />
      }
      {
        deleteConfirmation && <Confirmation
          question={"Вы действительно хотите удалить это поле?"}
          handler={handleDeleteField}
          visible={deleteConfirmation}
          setVisible={setDeleteConfirmation}
        />
      }
      {cityDescription &&
      <StyledRow col="4" className="admin-cities-table__row" title={cityDescription?.cityName}>
        <StyledCol data-title="Публикация" className="admin-cities-table__publish">
          <Checkbox
            className="default-checkbox"
            onChange={() => setPublishConfirmation(true)}
            checked={isPublish}
          />
        </StyledCol>
        <StyledCol data-title="Имя города" className="admin-cities-table__title">
          {cityDescription.cityName}
        </StyledCol>
        <StyledCol data-title="Описание города" className="admin-cities-table__desc">
          {ReactHtmlParser(cityDescription.description)}
        </StyledCol>
        <StyledCol data-title="Действие" className="admin-cities-table__action">
          <StyledButton
            to={`/panel/city-details/edit/${getID(cityDescription.id)}`}
            as={NavLink}
            color="info"
            weight="normal"
          >
            Редактировать
          </StyledButton>
          <StyledButton
            color="danger"
            onClick={() => setDeleteConfirmation(true)}
            weight="normal"
          >
            Удалить
          </StyledButton>
        </StyledCol>
      </StyledRow>}
    </React.Fragment>
  );
};

export default CityDetailsItem;