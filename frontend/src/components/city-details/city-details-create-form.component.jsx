import React, { useState } from "react";
import { useMutation } from "@apollo/react-hooks";
import CitySelectForCityDescription from "./city-select-for-city-description.component";
import CKEditor from "react-ckeditor-component";
import FragmentSpinner from "../spinner/fragment-spinner.component";
import { closableNotificationWithClick } from "../notification/closable-notification-with-click.component";

import { CREATE_CITY_DESCRIPTION } from "../../graphql/mutations/city-description.mutation";
import { GET_CITIES_DESCRIPTION } from "../../graphql/queries/cities-description.query";

import { StyledFormWrapper, StyledHiddenForm, StyledHiddenFormAction } from "../styles/styled-form";
import { StyledButton } from "../styles/styled-button";
import { StyledLoadingWrapper } from "../spinner/styled-spinner";
import DelayInputComponent from "../input-group/delay-input-group";
import { parseApiErrors } from "../../utils/response";

const CityDetailForm = () => {
  const [hide, setHide] = useState(true);
  const [errors, setErrors] = useState([]);
  const INITIAL_STATE = {
    cityName: "Выберите город",
    description: "",
    cityUrl: "",
    metaDescription: "",
    metaTitle: "",
    isPublish: false
  };
  const [cityDescription, setCityDescription] = useState(INITIAL_STATE);

  const [createCityDetails, {loading}] = useMutation(CREATE_CITY_DESCRIPTION, {
    update: (proxy, mutationResult) => {

      const addCityDescriptionToCitiesDescriptionList = (proxy, mutationResult) => {
        const citiesDescription = proxy.readQuery({
          query: GET_CITIES_DESCRIPTION
        });

        proxy.writeQuery({
          query: GET_CITIES_DESCRIPTION,
          data: {
            cityDescriptions: [...citiesDescription.cityDescriptions,
              mutationResult?.data?.createCityDescription?.cityDescription
            ]
          }
        });
      };
      addCityDescriptionToCitiesDescriptionList(proxy, mutationResult);
      setCityDescription(INITIAL_STATE);
      setErrors([]);
      closableNotificationWithClick("Город добавлен", "success");
    },
    onError: ({ graphQLErrors }) => {
      setErrors(parseApiErrors(graphQLErrors));
      if (errors.internal) {
        closableNotificationWithClick(errors.internal, "error");
      }
    }
  });

  const handleChangeInput = (event) => {
    const { name, value } = event.target;

    setCityDescription((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleCKEditorChangeInput = (event) => {
    const description = event.editor.getData();
    setCityDescription((prevState) => ({ ...prevState, description }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (cityDescription.description.length > 4999) {
      closableNotificationWithClick(
        "Вы превысили допустимое колличество символов в описании. Максимально колличество символов - 5000.",
        "error"
      );
      return;
    }

    if (
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

    createCityDetails({
      variables: {
        input: cityDescription
      }
    });
  };

  const showForm = () => {
    hide ? setHide(false) : setHide(true);
  };

  return (
    <StyledHiddenForm className="hidden-add-city-form">
      <StyledHiddenFormAction>
        <StyledButton type="button" color="main" onClick={showForm}>
          Добавить город
        </StyledButton>
      </StyledHiddenFormAction>
      <StyledLoadingWrapper mt="20">
        {loading && <FragmentSpinner position="center" />}
        <StyledFormWrapper
          onSubmit={handleSubmit}
          name={"city"}
          className={`add-city-form ${loading && "loading"}`}
          hide={hide}
        >
          <div className="add-city-form__body">
            <div className="add-city-form__main-content">
              <CitySelectForCityDescription
                label="Выберите город:"
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
            <div className="add-city-form__seo">
              <DelayInputComponent
                handleChange={handleChangeInput}
                value={cityDescription.metaTitle}
                name="metaTitle"
                type="string"
                label="Meta-Заголовок"
                debounceTimeout={600}
                autoComplete="off"
                required
                errorMessage={errors.metaTitle}
              />
              <DelayInputComponent
                handleChange={handleChangeInput}
                value={cityDescription.metaDescription}
                name="metaDescription"
                type="string"
                label="Meta-Описание"
                debounceTimeout={600}
                autoComplete="off"
                required
                errorMessage={errors.metaDescription}
              />
              <DelayInputComponent
                handleChange={handleChangeInput}
                value={cityDescription.cityUrl}
                name="cityUrl"
                type="string"
                label="URL"
                debounceTimeout={600}
                autoComplete="off"
                required
                errorMessage={errors.cityUrl}
              />
            </div>
          </div>
          <div className="add-city-form__action">
            <StyledButton
              type="submit"
              color="success"
              weight="normal"
              disabled={cityDescription.cityName === "Выберите город"}
            >
              Сохранить
            </StyledButton>
          </div>
        </StyledFormWrapper>
      </StyledLoadingWrapper>
    </StyledHiddenForm>
  );
};

export default CityDetailForm;