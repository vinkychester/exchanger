import React, { createContext, useCallback, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import queryString from "query-string";

import NewsFilter from "./news-filter.component";
import NewsAdminList from "./news-admin-list.component";

export const NewsFilterContext = createContext();

const NewsAdminContainer = () => {
  const history = useHistory();
  const searchParams = queryString.parse(history.location.search);
  
  const [filter, setFilter] = useState(Object.fromEntries(Object.entries(searchParams).filter(([_, v]) => v != null && v !== "")));
  const [totalCount, setTotalCount] = useState(0);

  const handleChangeFilter = useCallback(
    (name, value) => {
      let object = name !== "page" ? { [name]: value, page: 1 } : { [name]: value };
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
      search: queryString.stringify({ ...filtered }),
    });
  }, [filter]);
  
  return (
    <NewsFilterContext.Provider
      value={{ filter, handleChangeFilter, handleClearFilter, totalCount, setTotalCount }}
    >
      <NewsFilter />
      <NewsAdminList />
    </NewsFilterContext.Provider>
  );
};

export default NewsAdminContainer;
