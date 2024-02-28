import React, { createContext, useState, useCallback, useEffect } from "react";
import { useHistory } from "react-router-dom";
import queryString from "query-string";

import ClientFilter from "./client-filter.component";
import ClientList from "./client-list.component";

export const ClientFilterContext = createContext();

const ClientContainer = ({ sign }) => {
  let history = useHistory();
  let searchParams = queryString.parse(history.location.search);
  const [totalCount, setTotalCount] = useState(0);

  const [filter, setFilter] = useState(Object.fromEntries(Object.entries(searchParams).filter(([_, v]) => v != null && v !== "")));
  const field = `${sign}page`;

  const handleChangeFilter = useCallback(
    (name, value) => {
      let object = name !== field ? { [name]: value, [field]: 1 } : { [name]: value };
      setFilter((prevState) => ({
        ...prevState,
        ...object
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
    <ClientFilterContext.Provider
      value={{ filter, sign, handleChangeFilter, handleClearFilter, totalCount, setTotalCount }}
    >
      <ClientFilter />
      <ClientList />
    </ClientFilterContext.Provider>
  );
  
};

export default ClientContainer;