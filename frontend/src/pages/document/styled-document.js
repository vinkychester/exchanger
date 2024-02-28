import styled from "styled-components";

export const StyledDocumentWrapper = styled.div`
  padding: 20px 0;
  .document__description {
    margin-bottom: 15px;
    p {
      margin-bottom: 15px;
    }
  }
  
`;

export const StyledDocumentVerificationWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(256px, 1fr));
  gap: 30px;
`;

export const StyledDocumentVerificationItem = styled.div`
  padding: 15px;
  background-color: ${({theme}) => theme.bgElements};
  border-radius: 10px;
  .document-flow-action {
    margin-bottom: 15px;
    display: grid;
  }
  .document-flow-title {
    padding-bottom: 15px;
    margin-bottom: 15px;
    color: ${({theme}) => theme.defaultColor};
    font-size: 16px;
    font-weight: 700;
    text-align: center;
    border-bottom: 1px solid ${({theme}) => theme.borderElements};;
  }
  
  
  .payment-system-list {
    display: grid;
    grid-template-columns: 100%;
    grid-gap: 10px;
    &__item {
      
    }
  }
  .payment-system {
    display: grid;
    grid-template-columns: 25px repeat(2, max-content);
    grid-gap: 5px;
    &__name {
      font-weight: 700;
    }
  }
`;


export const StyledDocumentVerificationDetails = styled.div`
  padding: 20px 0;
  .document-verification-title {
    margin-bottom: 0;
    padding: 15px 0;
  }
  .document__frame {
    padding-top: 10px;
    iframe {
      width: 100%;
    }
  }
`;