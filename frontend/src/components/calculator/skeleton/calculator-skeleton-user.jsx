import React from "react";
import AlertMessage from "../../alert/alert.component";
import Spinner from "../../spinner/spinner.component";

import { StyledCalcSkeletonUser } from "./styled-skeleton-calculator";

const CalculatorSkeletonUser = () => {
  return (
    <StyledCalcSkeletonUser>
      <AlertMessage
        className="user-alert"
        type="info"
        message={<>
          Создание заявки для
          <Spinner display="inline-block" color="#EC6110" type="moonLoader" size="14px" margin="0 0 0 10px" />
        </>}
        margin="15px 0"
      />
    </StyledCalcSkeletonUser>
  );
};
export default CalculatorSkeletonUser;