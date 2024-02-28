import styled from "styled-components";

export const StyledProfitWrapper = styled.section`
  margin-bottom: 55px;
  padding: 75px 0 30px;
  background-color: ${({theme}) => theme.bgElements};
  position: relative;
  @media screen and (max-width: 768px) {
    margin-bottom: 0;
  }
  .bg-ellipse {
    width: 100%;
    height: 100%;
    background-color: ${({theme}) => theme.bgElements};
    position: absolute;
    bottom: -160px;
    z-index: 0;
    left: 0;
    -webkit-clip-path: ellipse(53% 10% at 50% 77%);
    clip-path: ellipse(53% 10% at 50% 77%);
    @media screen and (max-width: 992px) {
      bottom: -245px;
      clip-path: ellipse(53% 5% at 50% 80%);
    }
    @media screen and (max-width: 768px) {
      display: none;
    }
  }
  .home-profit-section__title {
    margin-bottom: 25px;
  }
  @media screen and (max-width: 992px) {
    padding: 50px 0;
  }
`;

export const StyledProfitContent = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 30px;
  @media screen and (max-width: 992px) {
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 15px;
  }
  @media screen and (max-width: 576px) {
    grid-template-columns: 100%;
  }
`;

export const StyledProfitItem = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 60px repeat(2, max-content);
  justify-content: center;
  grid-gap: 15px;
  opacity: 0.9;
  &:hover {
    .profit-item__icon {
      transform: scale(1.05);
    }
    .profit-item__title {
      color: ${({theme}) => theme.defaultColor};
    }
  }
  @media screen and (max-width: 992px) {
    padding: 25px 15px;
    background-color: ${({theme}) => theme.body};
    border-radius: 15px;
  }
  .profit-item__icon {
    height: 60px;
    width: 60px;
    margin: 0 auto;
    transition: all .3s ease;
    display: inline-flex;
    justify-content: center;
    align-items: center;
  }
  .profit-item__title {
    font-size: 16px;
    font-weight: 700;
    text-align: center;
  }
  .profit-item__text {
    line-height: 22px;
    @media screen and (max-width: 576px) {
      text-align: center;
    }
  }
`;
