import styled from 'styled-components';

export const StyledTitleWrapper = styled.div`
  margin-bottom: 50px;
  padding: 50px 0 23px;
  position: relative;
  z-index: 1;
  @media screen and (max-width: 768px) {
    margin-bottom: 25px;
    padding: 30px 0 15px;
  }
  @media screen and (max-width: 576px) {
    padding: 15px 0;
    font-size: 18px;
  }
`;

export const StyledTitle = styled.div`
  color: ${({theme}) => theme.text};
  font-size: 24px;
  font-weight: 700;
  text-transform: uppercase;
  @media screen and (max-width: 576px) {
    font-size: 18px;
  }
`;

export const StyledTitleDescription = styled.span`
  color: ${({theme}) => theme.defaultColor};
  font-size: 100px;
  font-weight: 700;
  text-transform: capitalize;
  position: absolute;
  bottom: 0px;
  left: -10px;
  z-index: -1;
  opacity: 0.1;
  overflow: hidden;
  @media screen and (max-width: 768px) {
    font-size: 75px;
    left: -5px;
  }
  @media screen and (max-width: 576px) {
    font-size: 47px;
    bottom: 5px
  }
`;
