import styled from "styled-components";

export const StyledAdministrationDetailsWrapper = styled.div`
  .administration-details__title {
    margin: 0;
    padding: 20px 0;
  }
  
  .choose-city {
    &__btn {
      margin-top: 5px;
      padding: 4px 8px;
      font-size: 12px;
    }
    &__label, .skeleton-label {
      font-size: 14px;
      letter-spacing: 0.3px;
      opacity: 0.4;
    }
  }
`;

export const StyledAdministrationDetailsContent = styled.div`
  padding-top: 20px;
  display: grid;
  grid-gap: 30px;
  grid-template-columns: minmax(0, 768px) 1fr;
  @media screen and (max-width: 1200px) {
    grid-template-columns: 100%;
  }
`;

export const StyledAdministrationCard = styled.div`
  padding: 20px;
  border: 1px solid ${({theme}) => theme.defaultColor};
  border-radius: 10px;
  @media screen and (max-width: 480px) {
    padding: 15px;
  }
`;

export const StyledAdministrationCardHead = styled.div`
  margin-bottom: 15px;
  padding-bottom: 20px;
  display: grid;
  grid-template-columns: 140px 1fr;
  grid-gap: 30px;
  align-items: center;
  border-bottom: 1px solid ${({theme}) => theme.borderElements};
  @media screen and (max-width: 576px) {
    grid-template-columns: 100px 1fr;
    grid-gap: 15px;
  }
  @media screen and (max-width: 480px) {
    padding-bottom: 15px;
    grid-template-columns: 100%;
    grid-gap: 15px;
  }
`;

export const StyledAdministrationCardBody = styled.div``;

export const StyledAdministrationName = styled.div`
  width: 100%;
  margin-bottom: 15px;
  display: inline-grid;
  grid-gap: 5px;
  .change-manager-name__btn {
    padding: 4px 8px;
    font-size: 12px;
  }
  .change-manager-name__fields {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 10px;
    @media screen and (max-width: 480px) {
      grid-template-columns: 100%;
    }
  }
  .input-group {
    margin-bottom: 0;
  }
  h4 {
    color: ${({theme}) => theme.defaultColor};
    font-size: 24px;
    font-weight: 700;
    line-height: 39px;
    text-transform: uppercase;
    @media screen and (max-width: 576px) {
      font-size: 18px;
    }
    @media screen and (max-width: 480px) {
      display: inline-flex;
    }
  }
`;

/*export const StyledAdministrationPhoto = styled.div`
  width: 140px;
  height: 140px;
  border: 2px solid ${({theme}) => theme.defaultColor};
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  @media screen and (max-width: 576px) {
    width: 100px;
    height: 100px;
  }
  img {
    width: 100%;
    height: 100%;
    object-position: center;
    object-fit: cover;
  }
`;*/

/*export const StyledAdministrationChangeForm = styled.div`
  max-width: 450px;
  margin-top: 15px;
  padding: 10px;
  background-color: ${({theme}) => theme.lightBg};
  border-bottom: 1px solid ${({theme}) => theme.borderElements};
  border-radius: 5px;
  .input-group {
    margin-bottom: 15px;
    label {
      display: flex;
      font-size: 12px;
      font-weight: 400;
      opacity: 0.5;
    }
  }
`;*/
