import styled from "styled-components";

export const StyledSkeletonRatesHead = styled.div`
  margin-top: 24px;
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-gap: 15px;
`;

export const StyledSkeletonRatesItem = styled.div`
  margin: 24px 0;
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-gap: 15px;
  .skeleton-name {
    display: grid;
    grid-template-columns: 45px 1fr;
    grid-gap: 15px;
  }
  .skeleton-mobile {
    display: none;
    overflow: auto;
  }
  @media screen and (max-width: 992px) {
    width: 992px;
    background-color: ${({theme}) => theme.bgElements};
  }
`;