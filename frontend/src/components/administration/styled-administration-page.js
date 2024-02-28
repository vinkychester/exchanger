import styled from 'styled-components';

export const StyledAdministrationWrapper = styled.div`
  .administration-navigation-title {
    margin: 0;
    padding: 20px 0;
  }
  .loading-create-user-form {
    margin-top: 20px;
  }
  .create-user-form {
    padding: 15px;
    background-color: ${({theme}) => theme.bgElements};
    border-color: ${({theme}) => theme.borderElements};
  }
`;

export const StyledAdministrationContent = styled.div`
  padding-top: 20px;
  display: grid;
  grid-template-columns: 256px 1fr;
  grid-gap: 30px;
  .edit-profit-percent {
    display: inline-grid;
  }
  @media screen and (max-width: 992px) {
    grid-template-columns: 1fr;
    grid-gap: 15px;
  }
`;

export const StyledAdministrationList = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 15px;
  .administration-card {
    &__row {
      display: grid;
      grid-template-columns: minmax(50px, auto) 1fr;
      align-items: center;
      justify-content: start;
      grid-gap: 10px;
    }
  }
  @media screen and (max-width: 1366px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media screen and (max-width: 992px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media screen and (max-width: 768px) {
    grid-template-columns: 1fr;
    grid-gap: 15px;
  }
  @media screen and (max-width: 576px) {
    .administration-card {
      &__row {
        display: inherit;
      }
    }
  }
`;
