import styled from "styled-components";

export const StyledBadgeNotification = styled.div`
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  color: #fff;
  font-size: 12px;
  font-weight: 400;
  line-height: 20px;
  text-align: center;
  white-space: nowrap;
  background: #FF5B5B;
  border-radius: 10px;
  z-index: auto;
  overflow: hidden;
  position: absolute;
  top: 50%;
  right: 20px;
  transform: translateY(-10px);
`;

export const StyledCounter = styled.div`
  font-weight: 700;
  color: ${({theme}) => theme.defaultColor};
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;