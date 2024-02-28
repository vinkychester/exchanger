import styled from "styled-components";

export const StyledRequisitionDetailsContact = styled.div`
  margin-bottom: 15px;
  display: flex;
  .contact-item {
    width: 22px;
    height: 22px;
    margin-right: 15px;
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
`;