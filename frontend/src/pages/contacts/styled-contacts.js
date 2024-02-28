import styled from "styled-components";

export const StyledContactsWrapper = styled.div`
  padding: 20px 0;
  .contacts-warning {
  }
  @media screen and (max-width: 768px) {
    .contacts-content {
      display: flex;
      flex-direction: column-reverse;
      .contacts-warning {
        margin: 15px 0;
      }
    }
  }
`;

export const StyledContactsForm = styled.div`
  display: grid;
  grid-template-columns: minmax(100px, 445px) 1fr;
  grid-gap: 30px;
  @media screen and (max-width: 992px) {
    grid-template-columns: 0.75fr 1fr;
    grid-gap: 15px;
  }
  @media screen and (max-width: 768px) {
    grid-template-columns: 100%;
  }
  .contact-form-align {
    display: flex;
    flex-direction: column;
  }
  .contact-select {
    padding-bottom: 20px;
    @media screen and (max-width: 768px) {
      padding-bottom: 15px;
    }
  }

  .contact-form {
    &__useterms {
      padding-top: 0;
      font-size: 12px;
      text-align: left;
    }
    &__action {
      text-align: right;
      position: relative;
    }
    &__tooltip {
      width: 135px;
      height: 100%;
      position: absolute;
      top: 0;
      right: 0;
    }
    &_tooltip-off {
      display: none;
    }
  }
  
  .contacts-wrapper {
    height: 100%;
    padding: 15px;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: ${({theme}) => theme.bgElements};
    border: 1px solid ${({theme}) => theme.borderElements};
    border-radius: 10px;
  }
`;

export const StyledContactsDetails = styled.div`
  width: 100%;
  .city-icon {
    height: 50px;
    margin-bottom: 15px;
    overflow: hidden;
    img {
      width: 100%;
      height: 50px;
      object-fit: contain;
      object-position: center;
    }
  }
  .contact-details {
    padding: 20px 0;
    display: flex;
    justify-content: center;
    &__item {
      width: 28px;
      height: 28px;
      margin-right: 20px;
      color: ${({theme}) => theme.defaultColor};
      font-size: 26px;
      display: inline-flex;
      justify-content: center;
      align-items: center;
      &:last-child {
        margin: 0;
      }
      &:hover {
        color: ${({theme}) => theme.text};
      }
    }
  }
`;