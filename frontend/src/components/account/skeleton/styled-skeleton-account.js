import styled from "styled-components";

export const StyledSkeletonAvatar = styled.div`
  width: 140px;
  height: 140px;
  color: ${({theme}) => theme.defaultColor};
  font-size: 36px;
  font-weight: 700;
  text-transform: uppercase;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 2px solid ${({theme}) => theme.defaultColor};
  background-color: ${({theme}) => theme.hoverColor};
  border-radius: 50%;
  overflow: hidden;
  position: relative;
  .fragment-spinner {
    width: 100%;
    height: 100%;
    position: absolute;
    display: flex;
    align-items: center;
  }
  @media screen and (max-width: 576px) {
    width: 100px;
    height: 100px;
  }
`;