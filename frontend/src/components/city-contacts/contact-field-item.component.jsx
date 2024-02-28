import React from "react";
import DelayInputComponent from "../input-group/delay-input-group";
import { getID } from "../../utils/calculator.utils";

const ContactFieldItem = ({ field, existedFields, handleChangeInput, ...otherProps}) => {

  return (
    <DelayInputComponent
      id={`${getID(field.id)}`}
      type={"text"}
      name={field.name}
      value={
        existedFields?.find(existedField => existedField.cityContactField?.name === field.name)?.value ?? ""
      }
      debounceTimeout={600}
      onChange={
        (event) => handleChangeInput({ event })
      }
      {...otherProps}
    />
  );
};

export default ContactFieldItem;