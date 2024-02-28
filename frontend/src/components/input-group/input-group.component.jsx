import React, { useState } from "react";

import {
  StyledError,
  StyledInput,
  StyledInputGroup,
  StyledInputWrapper,
  StyledLabel,
  StyledPasswordEye,
} from "./styled-input-group";

const InputGroupComponent = ({
  id,
  label,
  type,
  className,
  handleChange,
  name,
  maxLength,
  autocomplete,
  errors,
  ...otherProps
}) => {
  const [typePassword, setTypePassword] = useState("password");

  const changeType = () => {
    setTypePassword(typePassword === "password" ? "text" : "password");
  };

  return (
    <StyledInputGroup className={`input-group ${className}`} type={type}>
      {label && <StyledLabel htmlFor={id}>{label}:</StyledLabel>}
      <StyledInputWrapper>
        {type === "password" ? (
          <>
            <StyledInput
              type={typePassword}
              id={id}
              name={name}
              onChange={handleChange}
              {...otherProps}
            />
            <StyledPasswordEye type="button" onClick={changeType}>
              <span
                className={
                  typePassword === "password" ? "icon-eye-slash" : "icon-eye"
                }
              />
            </StyledPasswordEye>
          </>
        ) : (
          <StyledInput
            type={type}
            id={id}
            name={name}
            autoComplete={autocomplete}
            maxLength={maxLength}
            onChange={handleChange}
            {...otherProps}
          />
        )}
      </StyledInputWrapper>
      {errors && <StyledError>{errors[name]}</StyledError>}
    </StyledInputGroup>
  );
};

export default InputGroupComponent;
