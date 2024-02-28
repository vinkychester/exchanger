import styled from "styled-components";

export const StyledSkeletonTopExchange = styled.div`
  padding-top: 20px;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-gap: 15px;
  @media screen and (max-width: 992px) {
    display: none;
  }
`;
export const StyledSkeletonTopExchangeItem = styled.div`
  margin: 24px 0;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
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
    margin: 15px 0;
    padding: 15px;
    grid-template-columns: repeat(2, 1fr);
    background-color: ${({theme}) => theme.bgElements};
    border-radius: 10px;
    .skeleton-mobile {
      display: block;
    }
  }
`;