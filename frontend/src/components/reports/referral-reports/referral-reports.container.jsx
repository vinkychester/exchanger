import React, { createContext, useCallback, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import queryString from "query-string";

import LoyaltiProgramFilter from "./loyalty-program-filter.component";
import ReferralReportList from "./referral-report-list.component";

export const ReferralReportFilterContext = createContext();

const ReferralReportsContainer = () => {
  const format = "DD-MM-YYYY";

  let history = useHistory();
  let searchParams = queryString.parse(history.location.search);
  let params = Object.fromEntries(Object.entries(searchParams).filter(([_, v]) => v != null && v !== ""));

  const [filter, setFilter] = useState({
    ...params,
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
    <ReferralReportFilterContext.Provider
      value={{ filter, handleChangeFilter, handleClearFilter }}
    >
      <LoyaltiProgramFilter
        setFilter={setFilter}
        filter={filter}
      />
      <ReferralReportList />
    </ReferralReportFilterContext.Provider>
  );
};

export default ReferralReportsContainer;
