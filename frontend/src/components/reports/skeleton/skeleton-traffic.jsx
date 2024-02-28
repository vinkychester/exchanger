import React from "react";

import { StyledCol } from "../../styles/styled-table";
import { StyledSkeletonBg } from "../../styles/styled-skeleton-bg";

const SkeletonTraffic = () => {
  return (
    <>
      <StyledCol
        data-title="Кол-во зарегистрированных"
        className="traffic-list-table__count-register"
      >
        <StyledSkeletonBg
          color="theme"
          height="16"
          width="15"
        />
      </StyledCol>
      <StyledCol
        data-title="Кол-во заявок"
        className="traffic-list-table__count-requisitions"
      >
        <StyledSkeletonBg
          color="theme"
          height="16"
          width="15"
        />
      </StyledCol>
      <StyledCol
        data-title="Прибыль системы"
        className="traffic-list-table__system-profit"
      >
        <StyledSkeletonBg
          color="theme"
          height="16"
          width="25"
        />
      </StyledCol>
      <StyledCol
        data-title="Чистая прибыль системы"
        className="traffic-list-table__clean-profit"
      >
        <StyledSkeletonBg
          color="theme"
          height="16"
          width="25"
        />
      </StyledCol>
    </>
  );
};

export default SkeletonTraffic;