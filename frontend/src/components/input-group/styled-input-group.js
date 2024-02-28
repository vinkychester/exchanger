import styled from "styled-components";

const inputStyleTemplate = (theme) => {
  return `
    width: 100%;
    padding: 10px 5px;
    font-size: 16px;
    background-color: transparent;
    border-bottom: 1px solid ${theme.defaultColor};
    &:focus, &:active {
      border-color: ${theme.activeInputBorder};
      box-shadow: 0 8px 12px rgba(235, 95, 15, 0.15);
    }
    &::placeholder {
      color: ${theme.text};
      opacity: 0.2;
    }
    &:-webkit-autofill {
      -webkit-box-shadow: inset 0 0 0 50px ${theme.body};
      -webkit-text-fill-color: ${theme.text};
    }
    &:read-only {
      color: ${theme.textReadonly};
    }
    &:read-only:focus{
      box-shadow: none;
      background-color: transparent;
      border-bottom: 1px solid ${theme.defaultColor};
    }
  `;
};

export const StyledInputGroup = styled.div`
  margin-bottom: 15px;
  display: flex;
  flex-direction: column;
  ${({type}) => type === 'hidden' && `
    height: 0;
    margin: 0 !important;
    visibility: hidden;
    opacity: 0;
  `};
`;

export const StyledLabel = styled.label`
  margin-bottom: 3px;
  font-size: 16px;
  font-weight: 700;
  text-align: left;
`;


export const StyledInputWrapper = styled.div`
  display: grid;
  position: relative;
  &:before {
    content: '';
    height: 5px;
    width: 1px;
    background-color: ${({theme}) => theme.defaultColor};
    position: absolute;
    bottom: 0;
    left: 0;
  }
  &:after {
    content: '';
    height: 5px;
    width: 1px;
    background-color: ${({theme}) => theme.defaultColor};
    position: absolute;
    bottom: 0;
    right: 0;
  }
`;

export const StyledTextarea = styled.textarea`
  height: 125px;
  color: ${({theme}) => theme.text};
  font-family: inherit;
  resize: none;
  border: none;
  outline: none;
  ${({theme}) => inputStyleTemplate(theme)}
  
`

export const StyledInput = styled.input`
  ${({theme}) => inputStyleTemplate(theme)}
`;

export const StyledDelayInput = styled.div`
  input {
    ${({theme}) => inputStyleTemplate(theme)}
  }
`;

export const StyledMaskInput = styled.div`
  input {
    ${({theme}) => inputStyleTemplate(theme)}
  }
`;

export const StyledSkeletonInput = styled.div`
  width: 100%;
  padding: 11px 5px;
  background-color: transparent;
  border-bottom: 1px solid ${({theme}) => theme.defaultColor};
  & > div {
    margin: 0;
  }
`;

export const StyledPasswordEye = styled.button`
  margin: 0;
  padding: 0;
  color: ${({theme}) => theme.text};
  font-size: 16px;
  background-color: transparent;
  border: none;
  outline: none;
  position: absolute;
  bottom: 8px;
  right: 6px;
  cursor: pointer;
  opacity: 0.5;
  &:hover {
    opacity: 1;
  }
`;

export const StyledError = styled.div`
  padding: 5px 0 0;
  color: #FF5B5B;
  font-size: 12px;
  text-align: left;
`;


export const StyledCopyInput= styled.div`
  display: grid;
  grid-template-columns: 1fr 60px;
  grid-gap: 15px;
  .copy-input__btn-align {
    padding-bottom: 15px;
    display: inline-grid;
    align-items: end;
  }
`;