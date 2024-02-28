import React, { useContext } from "react";
import { useQuery } from "@apollo/react-hooks";
import { GET_MANAGERS_PROFIT_BY_PERIOD } from "../../../graphql/queries/profit.query";
import { convertDateToTimestampEnd, convertDateToTimestampStart } from "../../../utils/datetime.util";
import { parseUuidIRI } from "../../../utils/response";
import Spinner from "../../spinner/spinner.component";
import AlertMessage from "../../alert/alert.component";
import { StyledReportStatistics } from "../styled-reports";
import { ManagersReportsDetailsFilterContext } from "./managers-reports-details.container";

const ManagerReportRequisitionStatisticBlock = () => {

  const { filter, manager_id } = useContext(ManagersReportsDetailsFilterContext);

  const { date_gte, date_lte } = filter;

  const { data, loading, error } = useQuery(GET_MANAGERS_PROFIT_BY_PERIOD,{
    variables: {
      date_gte: convertDateToTimestampStart(date_gte),
      date_lte: convertDateToTimestampEnd(date_lte),
      manager: parseUuidIRI(manager_id),
      fieldName: 'profit'
    },
    fetchPolicy: "network-only",
  });

  if (loading) return <Spinner color="#EC6110" type="moonLoader" size="35px" />;
  if (error) return <AlertMessage type="error" message={error.message} />;
  if (!data) return <></>;

  const { managersQueryProfits } = data;

  if (!managersQueryProfits.length)
    return <AlertMessage type="info" message="Нет заявок" margin="15px 0" />;
  const { profits } = managersQueryProfits[0];


  return (
    <StyledReportStatistics>
      <div className="report-statistic__top">
        <div className="report-statistic__data">
          Общая прибыль системы за период: <span>{profits.systemProfit.toFixed(2) + " USD"}</span>
        </div>
        <div className="report-statistic__data">
          Общая прибыль менеджера по наличному и безналичному расчету за
          период: <span>{profits.managerProfit.toFixed(2) + " USD"}</span>
        </div>
        <div className="report-statistic__data">
          Общая прибыль менеджера по наличному расчету за период: <span>
            {profits.managerProfitCash.toFixed(2) + " USD"}</span>
        </div>
        <div className="report-statistic__data">
          Общая прибыль менеджера по безналичному расчету за
          период: <span>{profits.managerProfitBank.toFixed(2) + " USD"}</span>
        </div>
        <div className="report-statistic__data">
          Общая прибыль рефералов за период: <span>{profits.referralProfit.toFixed(2) + " USD"}</span>
        </div>
      </div>
    </StyledReportStatistics>
  )
}

export default ManagerReportRequisitionStatisticBlock;