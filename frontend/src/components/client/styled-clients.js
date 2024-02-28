import styled from 'styled-components';

export const StyledClientsWrapper = styled.div`
  .rc-tabs {
    overflow: inherit;
  }
  .client-title {
    margin: 0;
    padding: 20px 0;
  }
`;

export const StyledClientsList = styled.div`
  padding-top: 20px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(370px, 1fr));
  grid-gap: 15px;
  .clients-card {
    &__row {
      display: grid;
      grid-template-columns: minmax(50px, auto) 1fr;
      align-items: center;
      justify-content: start;
      grid-gap: 10px;
    }
  }
  .is-verified {
    padding: 0 0 3px 5px;
    color: #FF5B5B;
    cursor: pointer;
  }
  @media screen and (max-width: 768px) {
    grid-template-columns: 1fr;
  }
  @media screen and (max-width: 576px) {
    .clients-card {
      &__row {
        display: inherit;
      }
    }
  }
`;