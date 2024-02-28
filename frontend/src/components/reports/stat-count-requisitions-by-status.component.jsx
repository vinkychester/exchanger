import React, { useContext, useState } from "react";
import { useQuery } from "@apollo/react-hooks";
import { GET_ALL_REQUISITIONS } from "../../graphql/queries/requisition.query";
import AlertMessage from "../alert/alert.component";
import { PrepareParamsToQueryContext } from "./reports-container.component";
import SkeletonStatisticsItem from "./skeleton/skeleton-statistics-item";

const StatCountRequisitionsByStatus = ({ text, icon, status }) => {
  const { prepareParamsToQuery } = useContext(PrepareParamsToQueryContext);
  const [paginationInfo, setPaginationInfo] = useState({});
  prepareParamsToQuery.status = status;

  const { data, loading, error } = useQuery(GET_ALL_REQUISITIONS, {
      variables: prepareParamsToQuery,
      onCompleted: data => {
        setPaginationInfo(data.requisitions.paginationInfo);
      },
      fetchPolicy: "cache-and-network"
    }
  );

  if (loading) return <SkeletonStatisticsItem />;
  if (error) return <AlertMessage type="error" message={error.message} />;
  if (!data) return <AlertMessage type="warning" message="Информация о статистике недоступна" />;

  return (
    <>
      <div className="stat-item__icon">
        <span className={icon} />
      </div>
      <div className="stat-item__content">
        {text} <span>{paginationInfo.totalCount}</span>
      </div>
    </>
  );
};

export default StatCountRequisitionsByStatus;