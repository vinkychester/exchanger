import React, { createContext, useCallback, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import queryString from "query-string";

import { StyledAdminLogsWrapper } from "../../logs/styled-admin-logs";
import ClientDetailsLogsFilter from "./client-details-logs-filter.component";
import ClientDetailsLogsList from "./client-details-logs-list.component";

export const ClientDetailsLogsFilterContext = createContext();

const ClientDetailsLogs = ({ email }) => {
  let history = useHistory();
  let searchParams = queryString.parse(history.location.search);

  const [filter, setFilter] = useState(Object.fromEntries(Object.entries(searchParams).filter(([_, v]) => v != null && v !== "")));

  const handleChangeFilter = useCallback(
    (name, value) => {
      let object = name !== "lpage" ? { [name]: value, lpage: 1 } : { [name]: value };
      setFilter((prevState) => ({
        ...prevState,
        ...object,
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
      search: queryString.stringify({ ...filtered })
    });
  }, [filter]);

  return (
    <StyledAdminLogsWrapper>
      <ClientDetailsLogsFilterContext.Provider
        value={{ filter, handleChangeFilter, handleClearFilter }}
      >
        <ClientDetailsLogsFilter />
        <ClientDetailsLogsList email={email} />
      </ClientDetailsLogsFilterContext.Provider>
    </StyledAdminLogsWrapper>
  );
};

export default ClientDetailsLogs;