import React, { useState } from "react";
import InputGroupComponent from "../input-group/input-group.component";
import { useMutation, useQuery } from "@apollo/react-hooks";
import CitySelectForCityDescription from "./city-select-for-city-description.component";
import CKEditor from "react-ckeditor-component";
import PageSpinner from "../spinner/page-spinner.component";
import BreadcrumbItem from "../breadcrumb/breadcrumb-item";
import { NavLink } from "react-router-dom";
import { closableNotificationWithClick } from "../notification/closable-notification-with-click.component";

import { UPDATE_CITY_DESCRIPTION } from "../../graphql/mutations/city-description.mutation";
import { GET_CITY_DESCRIPTION_BY_ID } from "../../graphql/queries/cities-description.query";

import { StyledButton } from "../styles/styled-button";
import { StyledContainer } from "../styles/styled-container";
import { StyledAdminEditCity } from "./styled-admin-city";
import { StyledBreadcrumb } from "../styles/styled-breadcrumb";

const CityDetailEditForm = ({ id }) => {
  const [cityDescription, setCityDescription] = useState({
    id: "/api/city_descriptions/" + id,
    cityName: "Выберите город",
    description: "",
    cityUrl: "",
    metaDescription: "",
    metaTitle: "",
    isPublish: false
  });
  const [startCity, setStartCity] = useState();

  const { data, loading } = useQuery(GET_CITY_DESCRIPTION_BY_ID, {
    fetchPolicy: "network-only",
    variables: {
      id: "/api/city_descriptions/" + id
    },
    onCompleted: data => {
      setCityDescription(prevState => {
        return {
          ...prevState,
          cityName: data.cityDescription.cityName,
          description: data.cityDescription.description,
          cityUrl: data.cityDescription.cityUrl,
          metaDescription: data.cityDescription.metaDescription,
          metaTitle: data.cityDescription.metaTitle,
          isPublish: false
        };
      });
      setStartCity(data.cityDescription.cityName);
    }
  });

  const [updateCityDescription] = useMutation(UPDATE_CITY_DESCRIPTION, {
    onCompleted: () => {
      closableNotificationWithClick(
        `Описание города успешно сохранено.`,
        "success"
      );
    },
    onError: error => {
      closableNotificationWithClick(
        `${error.graphQLErrors[0].message}`,
        "error"
      );
    }
  });

  if (loading) return <PageSpinner />;

  const handleChangeInput = (event) => {
    const { name, value } = event.target;

    setCityDescription(prevState => {
      return {
        ...prevState,
        [name]: value.trim()
      };
    });

  };

  const handleCKEditorChangeInput = (event) => {
    const description = event.editor.getData();
    setCityDescription((prevState) => ({ ...prevState, description }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if(cityDescription.description.length > 4999) {
      closableNotificationWithClick(
        "Вы превысили допустимое колличество символов в описании. Максимально колличество символов - 5000.",
        "error"
      );
      return;
    }

    if(
      cityDescription.cityUrl.length > 1000
      || cityDescription.metaDescription.length > 1000
      || cityDescription.metaTitle.length > 1000
    ) {
      closableNotificationWithClick(
        "Вы превысили допустимое колличество символов в одном из СЕО полей. Максимальное колличество символов - 1000.",
        "error"
      );
      return;
    }

    updateCityDescription({
      variables: {
        input: {
          ...cityDescription,
        }
      }
    });
  };

  return (
    <StyledContainer size="xl">
      <StyledAdminEditCity>
        <div className="edit-city__head">
          <StyledBreadcrumb>
            <BreadcrumbItem
              as={NavLink}
              to="/"
              title="Главная"
            />
            <BreadcrumbItem
              as={NavLink}
              to="/panel/city-details"
              title="Города"
            />
            <BreadcrumbItem
              as="span"
              title="Редактировать город"
            />
          </StyledBreadcrumb>
        </div>


        {data?.cityDescription &&
        <form
          className="edit-city"
          onSubmit={handleSubmit}
          name={"city"}
        >
          <div className="edit-city__body">

            <div className="edit-city__content">
              <CitySelectForCityDescription
                additionalCity={startCity}
                checkedCity={cityDescription.cityName}
                setCheckedCity={(value) =>
                  setCityDescription(prevState => {
                    return {
                      ...prevState,
                      cityName: value
                    };
                  })
                }
              />
              <div className="ckeditor-wrapper">
                <div className="ckeditor-wrapper__label">Описание:</div>
                <CKEditor
                  content={cityDescription.description}
                  events={{
                    "change": handleCKEditorChangeInput
                  }}
                />
              </div>
            </div>

            <div className="edit-city__options">
              <InputGroupComponent
                handleChange={handleChangeInput}
                value={cityDescription.metaTitle}
                name="metaTitle"
                type="string"
                label="Meta-Заголовок"
                className="create-pair-form__priority"
              />
              <InputGroupComponent
                handleChange={handleChangeInput}
                value={cityDescription.metaDescription}
                name="metaDescription"
                type="string"
                label="Meta-Описание"
                className="create-pair-form__priority"
              />
              <InputGroupComponent
                handleChange={handleChangeInput}
                value={cityDescription.cityUrl}
                name="cityUrl"
                type="string"
                label="URL"
                className="create-pair-form__priority"
              />
            </div>
          </div>
          <div className="edit-city__action">
            <StyledButton
              type="submit"
              color="success"
              className="create-pair-form__button"
              weight="normal"
              disabled={cityDescription.cityName === "Выберите город"}
            >
              Сохранить
            </StyledButton>
          </div>
        </form>}
      </StyledAdminEditCity>
    </StyledContainer>
  );
};

export default CityDetailEditForm;