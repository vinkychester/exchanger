import React from "react";

import { StyledCitiesList } from "../../../pages/cities/styled-cities";
import { StyledSkeletonBg } from "../../styles/styled-skeleton-bg";

const CityItemSkeleton = () => {

  return (
    <StyledCitiesList>
      {Array.from(new Array(32)).map(() => (
        <div className="city" key={Math.random()}>
          <StyledSkeletonBg
            width={Math.floor(Math.random() * (100 - 75 + 1)) + 75}
            height="22"
          />
        </div>))}
    </StyledCitiesList>
  );
};
export default CityItemSkeleton;