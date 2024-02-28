import styled from "styled-components";

export const StyledCookieMessageWrapper = styled.div`
  width: 100%;
  background-color: ${({theme}) => theme.hoverShadow};
  border-top: 1px solid ${({theme}) => theme.defaultColor};
  padding: 15px 0;
  position: fixed;
  bottom: 0;
  z-index: 99999;
`;

export const StyledCookieMessageContainer = styled.div`
  max-width: 1140px;
  width: 100%;
  margin: 0 auto;
  padding: 0 15px;
  display: grid;
  grid-template-columns: 1fr max-content;
  grid-gap: 15px;
  p {
    text-align: justify;
    padding-bottom: 5px;
  }
  @media screen and (max-width: 768px) {
    grid-template-columns: 100%;
    text-align: center;
    p {
      text-align: center;
    }
  }
`;

export const StyledCookieMessageContent = styled.div``;
export const StyledCookieMessageAction = styled.div``;