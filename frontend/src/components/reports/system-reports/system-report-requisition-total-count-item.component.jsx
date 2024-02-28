import React, { useContext } from "react";
import { useQuery } from "@apollo/react-hooks";

import AlertMessage from "../../alert/alert.component";
import SkeletonStatisticsItem from "../skeleton/skeleton-statistics-item";

import { GET_REQUISITIONS_BY_STATUS } from "../../../graphql/queries/requisition.query";
import { SystemReportFilterContext } from "./system-report.container";
import {
  convertDateToTimestampStart,
  convertDateToTimestampEnd,
} from "../../../utils/datetime.util";

const SystemReportRequisitionTotalCountItem = ({ text, icon, status }) => {
  const { filter } = useContext(SystemReportFilterContext);
  const { rdate_gte, rdate_lte } = filter;

  const { data, loading, error } = useQuery(GET_REQUISITIONS_BY_STATUS, {
    variables: {
      status,
      rdate_gte: convertDateToTimestampStart(rdate_gte),
      rdate_lte: convertDateToTimestampEnd(rdate_lte),
    },
    fetchPolicy: "network-only",
  });

  if (loading) return <SkeletonStatisticsItem />;
  if (error) return <AlertMessage type="error" message={error.message} />;
  if (!data)
    return (
      <AlertMessage
        type="warning"
        message="Информация о статистике недоступна"
      />
    );

  const { totalCount } = data.requisitions.paginationInfo;

  return (
    <>
      <div className="stat-item__icon">
        <span className={icon} />
      </div>
      <div className="stat-item__content">
        {text} <span>{totalCount}</span>
      </div>
    </>
  );
};

export default SystemReportRequisitionTotalCountItem;
