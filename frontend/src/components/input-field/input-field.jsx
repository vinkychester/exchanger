import React, { useState } from "react";
import InputGroupComponent from "../input-group/input-group.component";

const InputField = ({type, initialValue, onInputChange}) => {
  const [inputField, setInputField] = useState(initialValue);

  const handleChange = (event) => {
    setInputField(event.target.value)
    onInputChange(event);
  }

  return (
    <InputGroupComponent type={type} value={inputField} handleChange={handleChange} />
  )
}

export default InputField;