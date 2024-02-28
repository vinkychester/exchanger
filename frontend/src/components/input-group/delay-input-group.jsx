import React, { useState } from "react";
import { DebounceInput } from "react-debounce-input";

import {
  StyledDelayInput,
  StyledError,
  StyledInputGroup,
  StyledInputWrapper,
  StyledLabel,
  StyledPasswordEye
} from "./styled-input-group";

const DelayInputComponent = ({
  id,
  label,
  name,
  type,
  value,
  className,
  debounceTimeout,
  handleChange,
  errorMessage,
  readonly,
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
            <StyledDelayInput>
              <DebounceInput
                id={id}
                type={typePassword}
                name={name}
                value={value}
                forceNotifyByEnter={true}
                forceNotifyOnBlur={true}
                debounceTimeout={debounceTimeout}
                onChange={handleChange}
                {...otherProps}
              />
            </StyledDelayInput>
            <StyledPasswordEye type="button" onClick={changeType}>
              <span
                className={
                  typePassword === "password" ? "icon-eye-slash" : "icon-eye"
                }
              />
            </StyledPasswordEye>
          </>
        ) : (
          <StyledDelayInput>
            <DebounceInput
              id={id}
              type={type}
              name={name}
              value={value}
              forceNotifyByEnter={true}
              forceNotifyOnBlur={true}
              debounceTimeout={debounceTimeout}
              readOnly={readonly} // ?
              onChange={handleChange}
              {...otherProps}
            />
          </StyledDelayInput>
        )}
      </StyledInputWrapper>
      {errorMessage && <StyledError>{errorMessage}</StyledError>}
    </StyledInputGroup>
  );
};

export default DelayInputComponent;
