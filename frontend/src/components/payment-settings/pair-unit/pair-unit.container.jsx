import React, { createContext, useCallback, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import queryString from "query-string";

import PairUnitList from "./pair-unit-list.component";
import PairUnitFilter from "./pair-unit-filter.component";
import PairUnitMultiply from "./pair-unit-multiply.component";

export const PairUnitFilterContext = createContext();

const PairUnitContainer = () => {
  let history = useHistory();
  let searchParams = queryString.parse(history.location.search);

  const [countChecked, setCountChecked] = useState(0);
  const [filter, setFilter] = useState(Object.fromEntries(Object.entries(searchParams).filter(([_, v]) => v != null && v !== "")));

  const handleChangeFilter = useCallback(
    (name, value) => {
      let object = name !== "upage" ? { [name]: value, upage: 1 } : { [name]: value };
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

  return (
    <PairUnitFilterContext.Provider
      value={{ filter, handleChangeFilter, handleClearFilter, setCountChecked, countChecked }}
    >
      <PairUnitMultiply />
      <PairUnitFilter />
      <PairUnitList />
    </PairUnitFilterContext.Provider>
  );
};

export default PairUnitContainer;
