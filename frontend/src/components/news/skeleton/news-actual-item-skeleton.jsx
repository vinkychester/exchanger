import React from "react";

import { StyledSkeletonBg } from "../../styles/styled-skeleton-bg";
import { StyledSkeletonActualItem } from "./styled-skeleton-news";

const NewsActualSkeleton = () => {
  return (
    <>
      {Array.from(new Array(3)).map(() => (
        <StyledSkeletonActualItem key={Math.random()}>
          <div className="actual-news__head">
            <StyledSkeletonBg
              color="theme"
              height="24"
            />
          </div>
          <div className="skeleton__body">
            <StyledSkeletonBg
              as="span"
              color="theme"
              height="20"
            />
            <StyledSkeletonBg
              as="span"
              color="theme"
              height="20"
            />
            <StyledSkeletonBg
              as="span"
              color="theme"
              height="20"
              width="70"
            />
          </div>
          <div className="skeleton__footer">
            <StyledSkeletonBg
              color="theme"
              height="20"
              width="25"
            />
            <StyledSkeletonBg
              height="20"
              width="20"
            />
          </div>
        </StyledSkeletonActualItem>))}
    </>
  );
};

export default NewsActualSkeleton;