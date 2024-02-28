import React, { createContext, useCallback, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import queryString from "query-string";

import PaymentSystemFilter from "./payment-system-filter.component";
import PaymentSystemList from "./payment-system-list.component";
import PaymentSystemMultiply from "./payment-system-multiply.component";

export const PaymentSystemContext = createContext();

const PaymentSystemContainer = () => {
  let history = useHistory();
  let searchParams = queryString.parse(history.location.search);
  const [countChecked, setCountChecked] = useState(0);
  const [filter, setFilter] = useState(Object.fromEntries(Object.entries(searchParams).filter(([_, v]) => v != null && v !== "")));
  const currentPage = filter.cpage ? parseInt(filter.cpage) : 1;
  const handleChangeFilter = useCallback(
    (name, value) => {
      let object = name !== "cpage" ? { [name]: value, cpage: 1 } : { [name]: value };
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
    <PaymentSystemContext.Provider
      value={{ filter, handleChangeFilter, handleClearFilter, setCountChecked, countChecked, currentPage }}
    >
      <PaymentSystemMultiply />
      <PaymentSystemFilter />
      <PaymentSystemList />
    </PaymentSystemContext.Provider>
  );
};

export default PaymentSystemContainer;
