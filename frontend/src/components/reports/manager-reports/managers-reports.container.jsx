import React, { createContext, useCallback, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import queryString from "query-string";

import ManagersReportsList from "./managers-reports-list.component";
import ManagersReportsFilter from "./managers-reports-filter.component";

import { endCurrentDate, startCurrentDate } from "../../../utils/datetime.util";
import ManagersReportsRequisitions from "./managers-reports-requisitions.component";

export const ManagersReportsFilterContext = createContext();

const ManagersReportsContainer = () => {
  const format = "DD-MM-YYYY";
  
  let history = useHistory();
  let searchParams = queryString.parse(history.location.search);
  let params = Object.fromEntries(Object.entries(searchParams).filter(([_, v]) => v != null && v !== ""));

  const [filter, setFilter] = useState({
    ...params,
    date_gte: params.date_gte ?? startCurrentDate(format),
    date_lte: params.date_lte ?? endCurrentDate(format),
  });

  const handleChangeFilter = useCallback(
    (name, value) => {
      setFilter((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    },
    [filter]
  );

  const handleClearFilter = useCallback(() => {
    setFilter({});
  }, [filter]);

  useEffect(() => {
    let filtered = Object.fromEntries(Object.entries(filter).filter(([_, v]) => v != null && v !== ""));
    history.replace({
      search: queryString.stringify({ ...filtered }),
    });
  }, [filter]);

  return (
    <ManagersReportsFilterContext.Provider
      value={{ filter, handleChangeFilter, handleClearFilter }}
    >
      <ManagersReportsFilter />
      <ManagersReportsRequisitions />
      <ManagersReportsList />
    </ManagersReportsFilterContext.Provider>
  )
}

export default ManagersReportsContainer;