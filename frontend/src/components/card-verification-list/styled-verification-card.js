import styled from "styled-components";

const colorStatus = {
  status: String
}

const styleStatus = (status) => {
  switch (status) {
    case 'VERIFIED':
      return `
        color: #1BA249;
    `;
    case 'PAST_DUE_DATE':
      return `
        color: #FF5B5B;
    `;
    case 'CANCELED':
      return `
        color: #FF5B5B;
    `;
    default:
      return `
        color: #FFA800;
    `;
  }
}

export const StyledCardStatus = styled('div', colorStatus)`
  ${({status}) => styleStatus(status)}
`;

export const StyledVerificationCardWrapper = styled.div`
  padding: 20px 0;
  .card-verification-head {
    display: grid;
    grid-template-columns: ${({ role }) => role === "client" ? "repeat(2, max-content) 1fr" : "1fr"};
    grid-gap: 15px;
    .card-verification-filter {
      display: grid;
      grid-template-columns: repeat(2, max-content) 1fr;
    }
    button, a {
      padding: 9px 14px;
    }
    @media screen and (max-width: 768px) {
      grid-template-columns: repeat(2, 1fr);
      .card-verification-filter {
        grid-column-start: 1;
        grid-column-end: 3;
      }
    }
    @media screen and (max-width: 576px) {
      grid-template-columns: 100%;
      .card-verification-filter {
        display: flex;
        flex-wrap: wrap;
        grid-column-start: inherit;
        grid-column-end: inherit;
      }
    }
  }
  
  .hidden-card-verification-form {
    margin: 0;
  }
  .card-verification-form {
    padding: 20px;
    background-color: ${({theme}) => theme.bgElements};
    border-color: ${({theme}) => theme.borderElements};
    &__action {
      padding-top: 10px;
      @media screen and (max-width: 480px) {
        padding-top: 0;
      }
    }
  }
  
  .verification-card-table {
    margin-top: 20px;
    padding-top: 20px;
    border-top: 1px solid ${({theme}) => theme.defaultColor};
    &__head, &__row {
      grid-template-columns: ${({role}) => role === "client" ? '110px repeat(3, 1fr) 215px' : '110px repeat(4, 1fr) 215px'};
    }
    &__action {
      grid-template-columns: repeat(auto-fit, 100px);
      justify-content: end;
      grid-gap: 15px;
    }
    .client {
      align-content: center;
      &__name {
        font-weight: 700;
        text-transform: uppercase;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        a:hover {
          color: ${({theme}) => theme.defaultColor};
        }
      }
      &__email {
        font-size: 12px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        opacity: 0.4;
      }
    }
    
    @media screen and (max-width: 992px) {
      padding-top: 0;
      &__row {
        margin: 15px 0;
        border-radius: 10px;
        background-color: ${({ theme }) => theme.bgElements};
        grid-template-columns: repeat(2, 1fr);
      }
      &__action {
        padding-top: 0;
        justify-content: end;
        grid-column-start: 1;
        grid-column-end: 3;
        &:before {
          display: none;
        }
      }
    }
    @media screen and (max-width: 576px) {
      &__row {
        grid-template-columns: 100%;
      }
      &__action {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
        justify-content: end;
        grid-column-start: inherit;
        grid-column-end: inherit;
      }
    }
  }
`;

export const StyledVerificationCardImages = styled.div`
  .images_errors {
    color: #FF5B5B;
  }
  .images__head {
    padding-bottom: 10px;
    display: inline-grid;
    grid-template-columns: repeat(2, max-content);
    grid-gap: 15px;
    @media screen and (max-width: 480px) {
      padding-bottom: 15px;
      grid-template-columns: 100%;
    }
  }
  .images__body {
    display: flex;
    flex-wrap: wrap;
  }
  .image-item {
    width: 200px;
    height: 150px;
    margin: 5px 10px 5px 0;
    border: 1px solid ${({ theme }) => theme.defaultColor};
    border-radius: 10px;
    overflow: hidden;
    position: relative;
    @media screen and (max-width: 480px) {
      width: 100%;
      margin: 0 0 15px !important;
      &:last-child {
        margin-bottom: 5px;
      }
    }
    &__action {
      width: 50px;
      display: flex;
      justify-content: space-between;
      position: absolute;
      top: 7px;
      right: 7px;
    }
    .action-button {
      width: 22px;
      height: 22px;
      color: #fff;
      font-size: 16px;
      display: inline-flex;
      justify-content: center;
      align-items: center;
      background-color: transparent;
      border: none;
      border-radius: 2px;
      opacity: 0.5;
      transition: all .3s ease;
      &:hover {
        opacity: 1;
      }
    }
    .action-button_update {
      background-color: #FFA800;;
    }
    .action-button_remove {
      background-color: #FF5B5B;
    }
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center;
    }
    &:last-child {
      margin: 5px 0;
    }
  }
`