import React from "react";
import SkeletonInput from "../../skeleton/skeleton-input";

import { StyledTabInputWrapper } from "../styled-calculator";

const CalculatorSkeletonInput = () => {
  return (
    <StyledTabInputWrapper className="exchange-data">
      <div
        className="exchange-data__input"
        data-currency=""
      >
        <SkeletonInput />
      </div>
      <div className="exchange-data__min-max">
        <p>
          Мин.:{" "}
          <span>
            пересчет...
          </span>{" "}
          / Макс.:{" "}
          <span>
            пересчет...
          </span>
        </p>
        <p>
          Комиссия за перевод: 5.55 , некоторые банки могут брать доп. комиссию
          за перевод
        </p>
      </div>
    </StyledTabInputWrapper>
  );
};
export default CalculatorSkeletonInput;