import styled from "styled-components";

export const StyledBankWrapper = styled.div`
  padding: 15px;
  background-color: ${({ theme }) => theme.bgElements};
  border: 1px solid ${({ theme }) => theme.borderElements};
  border-radius: 10px;
  .bank-title {
    margin-bottom: 15px;
    padding-left: 30px;
    padding-bottom: 15px;
    border-bottom: 1px solid ${({ theme }) => theme.borderElements};
    position: relative;
    &:before {
      content: '\\e923';
      width: 15px;
      height: 20px;
      color: ${({theme}) => theme.defaultColor};
      font-size: 20px;
      font-family: 'theme-icon', serif;
      position: absolute;
      left: 0;
      top: 0;
    }
    h2 {
      font-size: 16px;
      font-weight: 700;
    }
  }
`;