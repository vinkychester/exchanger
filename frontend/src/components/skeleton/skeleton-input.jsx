import React from 'react';
import Spinner from '../spinner/spinner.component';

import { StyledInputGroup, StyledInputWrapper, StyledLabel, StyledSkeletonInput } from '../input-group/styled-input-group';
import { StyledSkeletonBg } from "../styles/styled-skeleton-bg";

const SkeletonInput = ({label, width, className}) => {
  return (
    <StyledInputGroup className={className}>
      {label === 'skeleton' ?
        <StyledLabel>
          <StyledSkeletonBg
            width={width}
            height="18"
            color="theme"
          />
        </StyledLabel> : label && <StyledLabel>{label}:</StyledLabel>}
      <StyledInputWrapper>
        <StyledSkeletonInput>
          <Spinner color="#EC6110" type="moonLoader" size="15px" />
        </StyledSkeletonInput>
      </StyledInputWrapper>
    </StyledInputGroup>
  );
};

export default SkeletonInput;