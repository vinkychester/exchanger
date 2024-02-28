import React, { createContext, useEffect, useState, useCallback } from "react";
import { useHistory } from "react-router-dom";
import queryString from "query-string";

import BankDetailsFilter from "./bank-details-filter.component";
import BankDetailsList from "./bank-details-list.component";
import BankDetailsForm from "./bank-details-form.component";

export const BankDetailsFilterContext = createContext();

const BankDetailsContainer = () => {
  let history = useHistory();
  let searchParams = queryString.parse(history.location.search);

  const [filter, setFilter] = useState(Object.fromEntries(Object.entries(searchParams).filter(([_, v]) => v != null && v !== "")));

  const handleChangeFilter = useCallback(
    (name, value) => {
      let object = name !== "page" ? { [name]: value, page: 1 } : { [name]: value };
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
      search: queryString.stringify({ ...filtered }),
    });
  }, [filter]);


  const itemsPerPage = 10;
  const currentPage = filter.page ? parseInt(filter.page) : 1;

  return (
    <BankDetailsFilterContext.Provider
      value={{ filter, itemsPerPage, currentPage, handleChangeFilter, handleClearFilter }}
    >
      <BankDetailsForm />
      <BankDetailsFilter />
      <BankDetailsList />
    </BankDetailsFilterContext.Provider>
  );
};

export default BankDetailsContainer;
