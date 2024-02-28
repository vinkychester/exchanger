import styled from "styled-components";

export const StyledSkeletonReportStatistics = styled.div`
  padding-top: 20px;

  .report-statistic__top {
    border-bottom: 1px solid ${({ theme }) => theme.defaultColor};
    padding-bottom: 15px;
    margin-bottom: 15px;

    .report-statistic__data {
      display: flex;
      padding-bottom: 5px;

      & > div {
        margin-right: 5px;
      }
    }
  }


  .report-statistic__content {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: 1fr;
    grid-gap: 15px;
    @media screen and (max-width: 992px) {
      grid-template-columns: repeat(2, 1fr);
    }
    @media screen and (max-width: 576px) {
      grid-template-columns: 100%;
    }

    .stat-item__content {
      display: flex;

      & > div {
        margin-right: 5px;
      }
    }
`;