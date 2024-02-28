import React from "react";

import { StyledSkeletonBg } from "../../styles/styled-skeleton-bg";
import {
  StyledSkeletonRatesHead,
  StyledSkeletonRatesItem,
} from "./styled-skeleton-rates";
import Spinner from "../../spinner/spinner.component";

const RatesListSkeleton = () => {
  return (
    <>
      <StyledSkeletonRatesHead>
        {Array.from(new Array(5)).map(() => (
          <StyledSkeletonBg
            key={Math.random()}
            height="20"
            color="theme"
            className="head-item"
          />
        ))}
      </StyledSkeletonRatesHead>

      {Array.from(new Array(5)).map(() => (
        <StyledSkeletonRatesItem key={Math.random()}>
          <div className="skeleton-name">
            <StyledSkeletonBg height="40" color="theme" first />
            <StyledSkeletonBg height="40" color="theme" />
          </div>
          {Array.from(new Array(4)).map(() => (
            <StyledSkeletonBg key={Math.random()} height="40" color="theme" />
          ))}
          <div className="skeleton-mobile">
            <StyledSkeletonBg height="40" color="theme" />
          </div>
        </StyledSkeletonRatesItem>
      ))}
      {/* <Spinner color="#EC6110" type="moonLoader" size="32px" /> */}
    </>
  );
};

export default RatesListSkeleton;
