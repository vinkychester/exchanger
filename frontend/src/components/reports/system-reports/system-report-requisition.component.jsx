import React, { useContext } from "react";
import { useQuery } from "@apollo/react-hooks";

import { StyledReportStatistics } from "../styled-reports";
import { SystemReportFilterContext } from "./system-report.container";

import Spinner from "../../spinner/spinner.component";
import AlertMessage from "../../alert/alert.component";
import SystemReportRequisitionTotalCount from "./system-report-requisition-total-count.component";
import SystemReportClientList from "./system-report-client-list.component";

import { convertDateToTimestampEnd, convertDateToTimestampStart } from "../../../utils/datetime.util";

import { GET_PROFIT_BY_PERIOD } from "../../../graphql/queries/profit.query";

const SystemReportRequisition = () => {
  const { filter } = useContext(SystemReportFilterContext);

  const { rdate_gte, rdate_lte } = filter;
  const { data, loading, error } = useQuery(GET_PROFIT_BY_PERIOD, {
    variables: {
      date_gte: convertDateToTimestampStart(rdate_gte),
      date_lte: convertDateToTimestampEnd(rdate_lte)
    },
    fetchPolicy: "network-only"
  });
  
  if (loading) return <Spinner color="#EC6110" type="moonLoader" size="50px" />;
  if (error) return <AlertMessage type="error" message={error.message} />;
  if (!data) return <></>;
  
  const { collectionQueryProfits } = data;
  
  if (!collectionQueryProfits.length)
    return <AlertMessage type="info" message="Нет заявок за данный период" margin="15px 0 0" />;

  let systemProfitRequisitions = collectionQueryProfits.find(({ tempName }) => tempName === "systemProfit")?.tempValue ?? 0;
  let profitRequisitions = collectionQueryProfits.find(({ tempName }) => tempName === "profit");

  return (
    <>
      <SystemReportRequisitionTotalCount />
      <StyledReportStatistics>
        <div className="report-statistic__top">
          <div className="report-statistic__data">
            Общая прибыль системы за период: <span>{systemProfitRequisitions.toFixed(2)} USD</span>
          </div>
          <div className="report-statistic__data">
            Общая прибыль по заявкам за период: <span>{ profitRequisitions.tempValue ? profitRequisitions.tempValue.toFixed(2) : 0} USD</span>
          </div>
          <div className="report-statistic__data">
            Прибыль рефералов за период: <span>{profitRequisitions.profits.referralProfit ? profitRequisitions.profits.referralProfit.toFixed(2) : 0} USD</span>
          </div>
          <div className="report-statistic__data">
            Прибыль менеджеров по заявкам за период: <span>{profitRequisitions.profits.managerProfit ? profitRequisitions.profits.managerProfit.toFixed(2) : 0} USD</span>
          </div>
          <div className="report-statistic__data">
            Прибыль по кешбеку клиентов за период: <span>{profitRequisitions.profits.cashbackProfit ? profitRequisitions.profits.cashbackProfit.toFixed(2) : 0} USD</span>
          </div>
        </div>
      </StyledReportStatistics>
      <SystemReportClientList />
    </>
  );
};

export default SystemReportRequisition;
