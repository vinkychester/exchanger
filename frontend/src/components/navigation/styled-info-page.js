import styled from "styled-components";

export const StyledNavInformationPageWrapper = styled.div`
  padding: 20px 0;
  .info-page__link-wrapper {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 30px;
    @media screen and (max-width: 992px) {
      grid-template-columns: repeat(2, 1fr);
      grid-gap: 15px;
      .info-menu-item {
        margin-bottom: 15px;
        .info-menu-link {
          padding: 15px;
          display: grid;
          grid-gap: 15px;
          background-color: ${({ theme }) => theme.bgElements};
          border: 1px solid ${({ theme }) => theme.navBarBorder};
          border-radius: 10px;
          &:hover {
            background-color: ${({ theme }) => theme.hoverColor};
            border: 1px solid ${({ theme }) => theme.defaultColor};
          }
        }
      }
    }
    @media screen and (max-width: 768px) {
      grid-template-columns: 100%;
    }
    @media screen and (max-width: 374px) {
      .info-menu-item .info-menu-link{
        grid-template-columns: 100%;
        grid-gap: 10px;
        line-height: inherit;
        &__title {
          font-weight: 700;
        }
      }
    }
  }
`;