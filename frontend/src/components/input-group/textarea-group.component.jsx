import React from "react";
import { StyledError, StyledInputGroup, StyledInputWrapper, StyledLabel, StyledTextarea } from "./styled-input-group";

const TextAreaGroupComponent = ({
    id,
    label,
    className,
    handleChange,
    name,
    placeholder,
    value,
    required,
    readonly,
    maxLength,
    errors,
    defaultValue}) => {
  return (
    <StyledInputGroup className={`input-group ${className}`}>
      {label && <StyledLabel htmlFor={id}>{label}:</StyledLabel>}
      <StyledInputWrapper>
        <StyledTextarea
          id={id}
          name={name}
          onChange={handleChange}
          value={value}
          defaultValue={defaultValue}
          required={required}
          placeholder={placeholder}
          maxLength={maxLength}
          readOnly = { readonly }
        />
      </StyledInputWrapper>
      <StyledError>
        {errors && <StyledError>{errors}</StyledError>}
      </StyledError>
    </StyledInputGroup>
  );
};

export default TextAreaGroupComponent;
