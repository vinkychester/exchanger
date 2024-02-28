import React, { useContext } from "react";
import { useQuery } from "@apollo/react-hooks";

import Spinner from "../../spinner/spinner.component";
import AlertMessage from "../../alert/alert.component";

import { StyledReportClientsWrapper } from "../styled-reports";

import { GET_ALL_MANAGERS_FOR_STATISTICS } from "../../../graphql/queries/manager.query";
import { convertDateToTimestampEnd, convertDateToTimestampStart } from "../../../utils/datetime.util";
import { ManagersReportsFilterContext } from "./managers-reports.container";
import ManagerReportsItem from "./manager-reports-item.component";

const ManagersReportsList = () => {
  const { filter } = useContext(ManagersReportsFilterContext);
  const { date_gte, date_lte, page, ...props } = filter;

  const { data, loading, error } = useQuery(GET_ALL_MANAGERS_FOR_STATISTICS, {
    variables: {
      date_gte: convertDateToTimestampStart(date_gte),
      date_lte: convertDateToTimestampEnd(date_lte),
      ...props
    },
    fetchPolicy: "network-only"
  });

  if (loading) return <Spinner color="#EC6110" type="moonLoader" size="35px" />;
  if (error) return <AlertMessage type="error" message={error.message} />;
  if (!data) return <></>;

  const { collection } = data.managers;

  if (!collection.length)
    return <AlertMessage type="info" message="Нет менеджеров" margin="15px 0 0" />;

  return (
    <StyledReportClientsWrapper>
      {collection.map(manager =>
        <ManagerReportsItem
          key={manager.id}
          manager={manager}
        />)
      }
    </ StyledReportClientsWrapper>
  );
};

export default ManagersReportsList;