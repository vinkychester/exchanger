import React from "react";
import { StyledSkeletonBg } from "../../styles/styled-skeleton-bg";

const SkeletonStatisticsItem = () => {
  return (
    <>
      <div className="stat-item__icon">
        <StyledSkeletonBg
          width="50"
          height="16"
        />
      </div>
      <div className="stat-item__content stat-item_skeleton-content">
        <StyledSkeletonBg
          width="75"
          height="18"
          color="theme"
        />
        <StyledSkeletonBg
          width="8"
          height="18"
        />
      </div>
    </>
  );
};

export default SkeletonStatisticsItem;