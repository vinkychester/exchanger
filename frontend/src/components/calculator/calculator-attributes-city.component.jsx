import React, { useContext } from "react";
import Select, { Option } from "rc-select";
import { useQuery } from "@apollo/react-hooks";

import AlertMessage from "../alert/alert.component";
import SelectSkeleton from "../skeleton/skeleton-select";

import { GET_CITIES_LIST } from "../../graphql/queries/cities.query";
import { CalculatorContext, CalculatorAttributesContext, CalculatorExchangeContext } from "./calculator.component";

const CalculatorAttributesCity = ({ fieldName }) => {
  const { errors, handleChangeRequisitionDetails } = useContext(CalculatorContext);
  const { direction, attributes, pairUnitId } = useContext(CalculatorAttributesContext);

  const { data, loading, error } = useQuery(GET_CITIES_LIST, {
    variables: { pairUnit_id: pairUnitId, direction },
    fetchPolicy: "network-only",
  });

  const field = `${direction}Attributes`;

  const handleChangeCitySelect = (value, { label, key }) => {
    const elementsIndex = attributes.findIndex(
      (element) => element.name == fieldName
    );
    if (elementsIndex === -1) {
      handleChangeRequisitionDetails(
        field,
        attributes.concat({
          id: key,
          name: fieldName,
          isHidden: false,
          regex: "",
          value,
          information: label,
        })
      );
    } else {
      let newArray = [...attributes];
      newArray[elementsIndex] = {
        ...newArray[elementsIndex],
        value,
        information: label,
      };
      handleChangeRequisitionDetails(field, newArray);
    }
    handleChangeRequisitionDetails("exchangePoint", value);
  };

  if (loading) return <SelectSkeleton optionWidth="12" margin="0 0 10px 0"/>; // or <></>
  if (error) return <AlertMessage type="warning" message="There are no cities" />;
  if (!data) return <AlertMessage type="warning" message="Not found" />;

  const { collectionQueryCities } = data;

  if (!collectionQueryCities.length) return <AlertMessage type="warning" message="There are no cities" />;

  return (
    <>
      <Select
        className="custom-select-img"
        defaultValue=""
        onChange={handleChangeCitySelect}
        name={fieldName}
      >
        <Option value="" label="выбрать">
          <div className="save-requisite-select__item">Выберите город</div>
        </Option>
        {collectionQueryCities &&
          collectionQueryCities.map(({ id, name, externalId }) => (
            <Option key={id} value={externalId} label={name}>
              <div className="save-requisite-select__item">{name}</div>
            </Option>
          ))}
      </Select>
      <span style={{ color: "red" }}>{errors[fieldName]}</span>
    </>
  );
};

export default React.memo(CalculatorAttributesCity);