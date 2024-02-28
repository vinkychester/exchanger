import React, { useContext, useState } from "react";

import CalculatorAttributesCity from "./calculator-attributes-city.component";
import CalculatorAttributesSelect from "./calculator-attributes-select.component";
import DelayInputComponent from "../input-group/delay-input-group";

import { StyledSelect, StyledSelectLabel } from "../styles/styled-img-select";

import { CalculatorContext, CalculatorAttributesContext, CalculatorExchangeContext } from "./calculator.component";
import { CalculatorAttributesContentContext } from "./calculator-attributes.component";
import { getPlaceholder } from "../../utils/mask.util";

const CalculatorAttributesContent = () => {
  const { errors, handleChangeRequisitionDetails } = useContext(CalculatorContext);
  const { direction, attributes, subName } = useContext(CalculatorAttributesContext);
  const { collectionQueryAttributes, handleToggleCheckbox } = useContext(CalculatorAttributesContentContext);

  const [selected, setSelected] = useState("");

  const field = `${direction}Attributes`;
  const selectedFields = ["cardNumber", "wallet"]; //"email"

  const handleChangeAttribute = (event) => {
    const { name, value, id, pattern } = event.target;
    const elementsIndex = attributes.findIndex((element) => element.name == name);
    const element = attributes.find((element) => element.name === name);
    if (element && element.value !== value) {
      handleToggleCheckbox(true);
      setSelected("");
    }
    if (elementsIndex === -1) {
      handleChangeRequisitionDetails(
        field,
        attributes.concat({
          id,
          name,
          isHidden: false,
          regex: pattern,
          value: name === 'cardNumber' ? value.trim().replace(/-/g, "").replace(/\s+/g, "") : value.trim(),
          information: null,
        })
      );
    } else {
      let newArray = [...attributes];
      newArray[elementsIndex] = {
        ...newArray[elementsIndex],
        value: name === 'cardNumber' ? value.trim().replace(/-/g, "").replace(/\s+/g, "") : value.trim(),
      };
      handleChangeRequisitionDetails(field, newArray);
    }
  };

  return (
    <>
      {collectionQueryAttributes &&
        collectionQueryAttributes.map(
          ({ id, fieldType, name, title, regex }) => {
            const element = attributes.find((element) => element.name === name);
            return (
              <div key={id}>
                {"select" === fieldType && "CASH" === subName ? (
                  <StyledSelect className="save-requisite-select">
                    <StyledSelectLabel>{title}:</StyledSelectLabel>
                    <CalculatorAttributesCity fieldName={name} />
                  </StyledSelect>
                ) : (
                  <DelayInputComponent
                    id={id}
                    type={fieldType}
                    name={name}
                    label={title}
                    value={element ? element.value : ""}
                    placeholder={"cardNumber" === name ? "1234567890123456" : getPlaceholder(name)}
                    handleChange={handleChangeAttribute}
                    debounceTimeout={600}
                    errorMessage={errors[name]}
                    required={"contacts" !== name}
                  />
                )}
                {selectedFields.includes(name) && (
                  <CalculatorAttributesSelect
                    fieldName={name}
                    selected={selected}
                    setSelected={setSelected}
                  />
                )}
              </div>
            );
          }
        )}
    </>
  );
};

export default React.memo(CalculatorAttributesContent);
