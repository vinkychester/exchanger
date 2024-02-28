import styled from "styled-components";
import emptyImage from "../../assets/images/empty-image.svg";

export const StyledSkeletonSelect = styled.div`
  ${({ margin }) => margin && `margin: ${margin}`};
  .default-spinner {
    & > div {
      margin: 0 10px 0 0;
    }
  }
`;

export const StyledSkeletonImage = styled.div`
  height: 100%;
  width: 100%;
  background-color: ${({ theme }) => theme.hoverColor};
  background-image: url(${emptyImage});
  background-position: center center;
  background-size: contain;
  background-repeat: no-repeat;
  .default-spinner {
    height: 100%;
    display: flex;
    align-items: center;
    & > div {
      margin: 0 auto;
    }
  }
`;