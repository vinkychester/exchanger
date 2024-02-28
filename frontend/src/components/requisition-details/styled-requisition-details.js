import styled from "styled-components";

export const StyledRequisitionDetailsWrapper = styled.div`
  .requisition-info {
    padding: 15px;
    background-color: ${({ theme }) => theme.bgElements};
    border: 1px solid ${({ theme }) => theme.borderElements};
    border-radius: 10px;

    &__icon {
      margin-right: 5px;
    }

    &__main-data {
      b {
        text-transform: uppercase;
      }
    }
  }

  .requisite {
    &__item {
      padding: 5px 0 10px;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: flex-start;
      text-align: left;
      b {
        opacity: 0.25;
      }
      p {
        width: 100%;
        overflow-wrap: break-word;
        word-wrap: break-word;
      }
    }
  }
`;

export const StyledRequisitionDetailsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  @media screen and (max-width: 576px) {
    flex-direction: column-reverse;
    align-items: flex-start;
  }
`;
export const StyledRequisitionDetailsTitle = styled.h1`
  padding: 10px 0;
  font-size: 24px;
  span {
    text-transform: uppercase;
  }
  @media screen and (max-width: 768px) {
    font-size: 18px;
    text-align: center;
  }
`;

export const StyledRequisitionDetailsDate = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  .requisition-lifetime {
    color: ${({theme}) => theme.defaultColor};
    display: flex;
    align-items: center;
    .icon-clock {
      padding-right: 5px;
      color: ${({theme}) => theme.text};
      opacity: 0.5;
    }
    .auto-close {
      color: #c50000;
    }
    span {
      padding-top: 1px;
    }
  }
  .requisition-lifetime_expired {
    color: #FF5B5B;
  }
  time {
    opacity: 0.4;
  }
  @media screen and (max-width: 576px) {
    width: 100%;
    padding: 5px 0 10px;
    align-items: center;
    text-align: center;
  }
`;

export const StyledRequisitionDetailsBody = styled.div``;


export const StyledRequisitionSubmitForm = styled.form`
  display: grid;
  margin-top: 30px;
  grid-template-columns: repeat(auto-fill, minmax(110px, max-content));
  grid-gap: 15px;
  justify-content: start;
  @media screen and (max-width: 768px) {
    justify-content: center;
    grid-template-columns: repeat(2, 1fr);
  }
  @media screen and (max-width: 576px) {
    button, a {
      height: 100%;
    }
  }
`;

export const StyledRequisitionLink = styled.div`
  display: inline-grid;
  justify-content: end;
  align-items: end;
  @media screen and (max-width: 768px) {
    grid-template-columns: 100%;
    justify-content: center;
  }
`;