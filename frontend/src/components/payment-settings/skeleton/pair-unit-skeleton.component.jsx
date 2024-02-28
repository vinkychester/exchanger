import React from "react";
import Spinner from "../../spinner/spinner.component";

import { StyledSkeletonBg } from "../../styles/styled-skeleton-bg";
import { StyledSkeletonRatesHead, StyledSkeletonRatesItem } from "./styled-skeleton-pair-unit";

const PairUnitSkeleton = () => {
    return (
        <>
            <StyledSkeletonRatesHead>
                {Array.from(new Array(7)).map(() => (
                    <StyledSkeletonBg
                        key={Math.random()}
                        height="20"
                        color="theme"
                        borderRadius="3"
                        className="head-item"
                    />
                ))}
            </StyledSkeletonRatesHead>

            {Array.from(new Array(10)).map(() => (
                <StyledSkeletonRatesItem key={Math.random()}>
                    <div className="skeleton-name">
                        <StyledSkeletonBg
                            height="56"
                            color="theme"
                            borderRadius="5"
                            first
                        />
                        <StyledSkeletonBg
                            height="56"
                            color="theme"
                            borderRadius="5"
                        />
                    </div>
                    {Array.from(new Array(6)).map(() => (
                        <StyledSkeletonBg
                            key={Math.random()}
                            height="56"
                            color="theme"
                            borderRadius="5"
                        />
                    ))}
                    <div className="skeleton-mobile">
                        <StyledSkeletonBg
                            height="56"
                            color="theme"
                            borderRadius="5"
                        />
                    </div>
                </StyledSkeletonRatesItem>
            ))}
          <Spinner
            color="#EC6110"
            type="moonLoader"
            size="32px"
          />
        </>
    );
};

export default PairUnitSkeleton;