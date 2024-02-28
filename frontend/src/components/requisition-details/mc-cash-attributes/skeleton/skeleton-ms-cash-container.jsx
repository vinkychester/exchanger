import React from "react";

import { StyledMSCashWrapper } from "../styled-ms-cash-container";
import SelectSkeleton from "../../../skeleton/skeleton-select";
import SkeletonInput from "../../../skeleton/skeleton-input";
import Spinner from "../../../spinner/spinner.component";

const SkeletonMSCashContainer = () => {
  return (
    <StyledMSCashWrapper>
      <SelectSkeleton optionWidth="55" label="Выбрать направление сети" className="mscash-field"/>
      <SkeletonInput className="mscash-field" label="skeleton" width="35"/>
      <SkeletonInput className="mscash-field" label="skeleton" width="35"/>
      <Spinner color="#EC6110" type="moonLoader" size="25px"/>
    </StyledMSCashWrapper>
  );
};

export default SkeletonMSCashContainer;