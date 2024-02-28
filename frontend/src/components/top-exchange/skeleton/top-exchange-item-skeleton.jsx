import React from "react";
import Spinner from "../../spinner/spinner.component";

import {
  StyledSkeletonTopExchange,
  StyledSkeletonTopExchangeItem,
} from "./styled-skeleton-top-exchange";
import { StyledSkeletonBg } from "../../styles/styled-skeleton-bg";

const TopExchangeItemSkeleton = () => {
  return (
    <>
      <StyledSkeletonTopExchange>
        <StyledSkeletonBg
          key={Math.random()}
          height="20"
          color="theme"
          className="head-item"
        />
        <div />
        <StyledSkeletonBg
          key={Math.random()}
          height="20"
          color="theme"
          className="head-item"
        />
        <div />
        <div />
      </StyledSkeletonTopExchange>
      {Array.from(new Array(5)).map(() => (
        <StyledSkeletonTopExchangeItem key={Math.random()}>
          <div className="skeleton-name">
            <StyledSkeletonBg height="40" color="theme" first />
            <StyledSkeletonBg height="40" color="theme" />
          </div>
          <StyledSkeletonBg height="40" color="theme" />

          <div className="skeleton-name">
            <StyledSkeletonBg height="40" color="theme" first />
            <StyledSkeletonBg height="40" color="theme" />
          </div>
          <StyledSkeletonBg height="40" color="theme" />
          <StyledSkeletonBg height="40" color="theme" />

          <div className="skeleton-mobile">
            <StyledSkeletonBg height="40" color="theme" />
          </div>
        </StyledSkeletonTopExchangeItem>
      ))}
      {/*<Spinner
        color="#EC6110"
        type="moonLoader"
        size="32px"
      />*/}
    </>
  );
};

export default TopExchangeItemSkeleton;
