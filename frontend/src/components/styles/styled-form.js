import styled from 'styled-components';

export const StyledFormWrapper = styled.form`
  ${({hide}) => hide && 'height: 0'};
  ${({hide}) => hide && 'display: none'};
  padding: 30px;
  border-radius: 10px;
  border: 1px solid ${({theme}) => theme.defaultColor};
   ${({hide}) => hide === false ? 'animation: loadContent .15s ease' : 'animation: none'};
  @media screen and (max-width: 567px) {
    padding: 15px;
  }
`;

export const StyledFormTitle = styled.div`
  color: ${({theme}) => theme.defaultColor};
  font-size: 24px;
  text-align: center;
`;

export const StyledFormText = styled.div`
    padding: 15px 0;
    text-align: center;
`;

export const StyledHiddenForm = styled.div`
  margin: 20px 0;
  grid-template-columns: 1fr;
  display: grid;
  //grid-gap: 20px;
`;
export const StyledHiddenFormAction = styled.div`
  display: inline-grid;
  justify-content: start;
`;