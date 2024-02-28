import styled from "styled-components";

export const StyledAdminRequisitionDetails = styled.div`
  margin-top: 15px;
  padding-top: 20px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 30px;
  border-top: 1px solid ${({ theme }) => theme.navBarBorder};
  .requisition-info {
    &__item {
      margin-bottom: 8px;
      padding-bottom: 8px;
      border-bottom: 1px solid ${({ theme }) => theme.navBarBorder};
      &:last-child {
        margin-bottom: 0;
        padding-bottom: 0;
        border-bottom: none;
      }
    }
    &__title {
      padding-bottom: 0;
      font-weight: 600;
      a:hover {
        color: ${({theme}) => theme.defaultColor};
      }
    }
  }
  @media screen and (max-width: 768px) {
    padding-top: 15px;
    grid-template-columns: 1fr;
    grid-gap: 15px;
  }  
`;