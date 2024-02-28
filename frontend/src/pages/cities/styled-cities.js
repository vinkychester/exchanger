import styled from "styled-components";

export const StyledCitiesWrapper = styled.div`
  padding: 20px 0;
  .cities-title {
    
  }
  p {
    text-align: justify;
  }
`;

export const StyledCitiesList = styled.div`
  padding-bottom: 15px;
  margin-bottom: 20px;
  border-bottom: 1px solid ${({theme}) => theme.borderElements};
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  column-gap: 30px;
  row-gap: 15px;
  @media screen and (max-width: 992px) {
    grid-template-columns: repeat(4, 1fr);
    column-gap: 15px;
  }
  @media screen and (max-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }
  @media screen and (max-width: 576px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media screen and (max-width: 489px) {
    grid-template-columns: 100%;
  }
  .city {
    &__link {
      font-size: 16px;
    }
  }
`;

export const StyledCityDetails = styled.div`
  padding: 25px 0 0;
  .city-details__title {
    margin-bottom: 0;
    padding: 15px 0;
  }
  .city-details__content {
    max-width: 800px;
    width: 100%;
    margin: 0 auto;
    padding-top: 20px;
    a {
      color: ${({ theme }) => theme.defaultColor};
      transition: all .1s ease;
      cursor: pointer;
      &:hover {
        text-decoration: underline;
      }
    }
  }
  .top-exchange {
    padding-top: 50px;
    &__title {
      margin-bottom: 25px;
    }
  }
`;