import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import CurrencyList from "../currency/currency-list.component";

export const PaginationContext = React.createContext({
  currentPage: 1,
  itemsPerPage: 10,
});

const CurrencyContainer = ({ tag }) => {
  let history = useHistory();
  let searchParams = new URLSearchParams(history.location.search);
  let currentPage = parseInt(searchParams.get("p" + tag.toLowerCase()) ?? 1);

  const paginationContext = useContext(PaginationContext);
  const [paginationInfo, setPaginationInfo] = useState({
    ...paginationContext,
    currentPage
  });

  useEffect(() => {
    setPaginationInfo({ ...paginationContext, currentPage });
  }, [currentPage]);


  return (
    <React.Fragment>
      <PaginationContext.Provider value={paginationInfo}>
        <CurrencyList tag={tag}/>
      </PaginationContext.Provider>
    </React.Fragment>
  );
};

export default CurrencyContainer;
