import styled from "styled-components";

export const StyledSkeletonRatesHead = styled.div`
  margin-top: 24px;
  display: grid;
  grid-template-columns: repeat(3, 1fr) repeat(2, 200px);
  grid-gap: 15px;
  @media screen and (max-width: 992px) {
    display: none;
  }
`;

export const StyledSkeletonRatesItem = styled.div`
  margin: 24px 0;
  display: grid;
  grid-template-columns: repeat(3, 1fr) repeat(2, 200px);
  grid-gap: 15px;
  .skeleton-name {
    display: grid;
    grid-template-columns: 45px 1fr;
    grid-gap: 15px;
  }
  .skeleton-mobile {
    display: none;
  }
  @media screen and (max-width: 992px) {
    padding: 15px;
    grid-template-columns: repeat(2, 1fr);
    background-color: ${({ theme }) => theme.bgElements};
    border-radius: 10px;
    .skeleton-mobile {
      display: block;
    }
  }
`;
