import React, { useEffect } from "react";
import { useQuery } from "@apollo/react-hooks";

import $ from "jquery";
import "jquery-mask-plugin/dist/jquery.mask.min.js";

import AlertMessage from "../alert/alert.component";
import DelayInputComponent from "../input-group/delay-input-group";
import BankDetailsAttrSkeleton from "./skeleton/bank-details-attributes-skeleton";

import { StyledButton } from "../styles/styled-button";

import { GET_ATTRIBUTES } from "../../graphql/queries/attribute.query";
import { parseIRI } from "../../utils/response";
import { getMask, getPlaceholder } from "../../utils/mask.util";

const BankDetailsAttributes = ({
  details,
  attributes,
  setAttributes,
  handleChangeRequisitesDetails,
  errors,
}) => {
  const { pairUnit, direction, title } = details;
  const { data, loading, error } = useQuery(GET_ATTRIBUTES, {
    fetchPolicy: "network-only",
    variables: { pairUnit_id: parseIRI(pairUnit), direction, locale: "ru" }, 
  });

  useEffect(() => {
    if (data) {
      const { collectionQueryAttributes } = data;
      if (collectionQueryAttributes.length !== 0) {
        let requisites = [];
        collectionQueryAttributes.map(({ id, fieldType, name, regex }) => {
          getMask(name) !== "" && $(`input[name=${name}]`).mask(getMask(name));
          if ("hidden" === fieldType)
            requisites.push({
              id,
              name,
              isHidden: true,
              regex,
              value: "",
              information: null,
            });
        });
        setAttributes(requisites);
      }
    }
  }, [data]);

  const handleChangeAttribute = (event) => {
    const { name, value, id, pattern } = event.target;
    const elementsIndex = attributes.findIndex((element) => element.id === id);
    if (elementsIndex === -1) {
      setAttributes(
        attributes.concat({
          id,
          name,
          isHidden: false,
          regex: pattern,
          value: value.trim(),
          information: null,
        })
      );
    } else {
      let newArray = [...attributes];
      newArray[elementsIndex] = {
        ...newArray[elementsIndex],
        value: value.trim(),
      };
      setAttributes(newArray);
    }
  };

  if (loading) return <BankDetailsAttrSkeleton />;
  if (error) return <AlertMessage type="warning" message="Error" />;
  if (!data) return <AlertMessage type="warning" message="Not found" />;

  const { collectionQueryAttributes } = data;

  if (!collectionQueryAttributes.length)
    return (
      <AlertMessage
        type="warning"
        message="Нет данных для заполнения"
        margin="15px 0 0"
      />
    );

  return (
    <>
      <DelayInputComponent
        type="text"
        name="title"
        label="Название"
        className="bank-details-form__input"
        value={title}
        placeholder="Реквизит"
        errorMessage={errors.title}
        handleChange={(event) =>
          handleChangeRequisitesDetails({ title: event.target.value.trim() })
        }
        debounceTimeout={600}
        required
      />
      {collectionQueryAttributes &&
        collectionQueryAttributes.map(
          ({ id, fieldType, name, title, regex }) => {
            const element = attributes.find((element) => element.name === name);
            return (
              "hidden" !== fieldType && (
                <DelayInputComponent
                  id={id}
                  key={id}
                  type={fieldType}
                  name={name}
                  label={title}
                  className="bank-details-form__input"
                  value={element ? element.value : ""}
                  placeholder={getPlaceholder(name)}
                  // pattern={regex}
                  handleChange={handleChangeAttribute}
                  debounceTimeout={600}
                  errorMessage={errors[name]}
                  required
                />
              )
            );
          }
        )}
      <StyledButton type="submit" color="success">
        Сохранить
      </StyledButton>
    </>
  );
};

export default BankDetailsAttributes;
