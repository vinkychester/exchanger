import React, { createContext, useState, useCallback, useEffect } from "react";
import { useHistory } from "react-router-dom";
import queryString from "query-string";

import SystemReportFilter from "./system-report-filter.component";

import {
  startCurrentDate,
  endCurrentDate,
} from "../../../utils/datetime.util";
import SystemReportRequisition from "./system-report-requisition.component";

export const SystemReportFilterContext = createContext();

const SystemReportContainer = () => {
  const format = "DD-MM-YYYY";
  
  let history = useHistory();
  let searchParams = queryString.parse(history.location.search);
  let params = Object.fromEntries(Object.entries(searchParams).filter(([_, v]) => v != null && v !== ""));
  
  const [filter, setFilter] = useState({
    ...params,
    rdate_gte: params.rdate_gte ?? startCurrentDate(format),
    rdate_lte: params.rdate_lte ?? endCurrentDate(format),
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
    setFilter({ rdate_gte: startCurrentDate(format), rdate_lte: endCurrentDate(format) });
  }, [filter]);

  useEffect(() => {
    let filtered = Object.fromEntries(Object.entries(filter).filter(([_, v]) => v != null && v !== ""));
    history.replace({
      search: queryString.stringify({ ...filtered }),
    });
  }, [filter]);

  return (
    <SystemReportFilterContext.Provider
      value={{ filter, handleChangeFilter, handleClearFilter }}
    >
      <SystemReportFilter />
      <SystemReportRequisition />
    </SystemReportFilterContext.Provider>
  );
};

export default SystemReportContainer;
