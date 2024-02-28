import React from "react";
import { StyledSkeletonReportStatistics } from "./styled-skeleton-report";
import { StyledSkeletonBg } from "../../styles/styled-skeleton-bg";

const SkeletonStatistics = () => {
  return (
    <StyledSkeletonReportStatistics>
      <div className="report-statistic__top">
        <div className="report-statistic__data">
          <StyledSkeletonBg
            width="16"
            height="18"
            color="theme"
          />
          <StyledSkeletonBg
            width="3"
            height="18"
          />
        </div>
        <div className="report-statistic__data">
          <StyledSkeletonBg
            width="18"
            height="18"
            color="theme"
          />
          <StyledSkeletonBg
            width="3"
            height="18"
          />
        </div>
        <div className="report-statistic__data">
          <StyledSkeletonBg
            width="18"
            height="18"
            color="theme"
          />
          <StyledSkeletonBg
            width="5"
            height="18"
          />
        </div>
      </div>
    </StyledSkeletonReportStatistics>
  );
};

export default SkeletonStatistics;