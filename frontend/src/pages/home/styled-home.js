import styled from "styled-components";

export const StyledHome = styled.div``;

export const StyledHomeTitleWrapper = styled.section`
  padding: 50px 0 25px;
  .home-title {
    font-size: 16px;
    font-weight: 700;
    span {
      color: ${({ theme }) => theme.defaultColor};
      text-decoration: underline;
    }
  }

  .home-subtitle {
    padding-top: 10px;
    font-size: 16px;
    opacity: .5;
  }
  @media screen and (max-width: 992px) {
    padding: 15px 0 25px;
    text-align: justify;
  }
`;