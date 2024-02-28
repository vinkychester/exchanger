import React, { useState } from "react";
import { closableNotificationWithClick } from "../notification/closable-notification-with-click.component";
import { CopyToClipboard } from "react-copy-to-clipboard";

import { StyledCopyInput, StyledInput, StyledInputGroup, StyledInputWrapper, StyledLabel } from "./styled-input-group";
import { StyledButton } from "../styles/styled-button";

const CopyInputComponent = ({ id, name, value, defaultValue, className, type, label, readOnly }) => {

  const [copied, setCopied] = useState(false);
  // const [value, setValue] = useState('');

  // const handleChange = (e) => {
  //   setValue(e.target.value);
  //   setCopied(false);
  // }

  return (
    <StyledCopyInput className={`copy-input ${className}`}>
      <StyledInputGroup>
        {label && <StyledLabel htmlFor={id}>{label}:</StyledLabel>}
        <StyledInputWrapper>
          <StyledInput
            id={id}
            type={type}
            name={name}
            defaultValue={defaultValue}
            value={value}
            readOnly={readOnly}
          />
        </StyledInputWrapper>

      </StyledInputGroup>
      <CopyToClipboard
        text={value || defaultValue}
        onCopy={() => {
          setCopied(true);
          closableNotificationWithClick("Скопировано", "success");
        }}
      >
        <div className="copy-input__btn-align">
          <StyledButton>
            <span className="icon-copy" />
          </StyledButton>
        </div>

      </CopyToClipboard>
      {/*{copied && closableNotificationWithClick("Скопированно", "success")}*/}
    </StyledCopyInput>
  );
};

export default CopyInputComponent;