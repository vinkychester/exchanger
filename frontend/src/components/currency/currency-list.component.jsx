import React, { useContext, useState } from "react";
import { useQuery } from "@apollo/react-hooks";

// import "rc-checkbox/assets/index.css";
// import "rc-switch/assets/index.css";

import { GET_CURRENCIES } from "../../graphql/queries/currency.query";

import {
  StyledColHead,
  StyledTable,
  StyledTableBody,
  StyledTableHeader,
} from "../styles/styled-table";
import { useHistory } from "react-router-dom";

import AlertMessage from "../alert/alert.component";
import Spinner from "../spinner/spinner.component";

import CurrencyItem from "./currency-item.component";
import { PaginationContext } from "./currency.container";
import CustomPagination from "../pagination/pagination.component";

const CurrencyList = ({ tag }) => {
  const paginationContext = useContext(PaginationContext);

  let history = useHistory();

  const [listTag, setListTag] = useState(tag);

  const { loading, error, data } = useQuery(GET_CURRENCIES, {
    variables: { page: paginationContext.currentPage, itemsPerPage: paginationContext.itemsPerPage, "tag": listTag },
    fetchPolicy: "cache-and-network"
  });

  const onPaginationPageChange = (page) => {
    const url = new URL(window.location.href);
    url.searchParams.set("p" + listTag.toLowerCase(), page.toString());

    history.push({
      pathname: url.pathname,
      search: url.search
    });
  };

  if (loading) return <Spinner color="#EC6110" type="moonLoader" size="50px"/>;
  if (error) return <AlertMessage type="error" message={error.message}/>;
  if (!data) return <AlertMessage type="warning" message="Not found."/>;

  const { collection, paginationInfo } = data.currencies;

  if (!collection.length)
    return (
      <AlertMessage
        type="warning"
        message="Валюты отсутствуют."
      />
    );

  return (

    <StyledTable className="currency-table">
      <StyledTableHeader col="4" className="currency__header">
        <StyledColHead>Аббревиатура</StyledColHead>
        <StyledColHead>Курс</StyledColHead>
        <StyledColHead>Курс покупки</StyledColHead>
        <StyledColHead>Курс продажи</StyledColHead>
      </StyledTableHeader>
      <StyledTableBody>
        {collection && collection.map(({ id, ...props }) => (
          <CurrencyItem key={id} {...props} />
        ))}
      </StyledTableBody>
      {!loading ?
        <CustomPagination total={+paginationInfo.totalCount}
                          pageSize={+paginationContext.itemsPerPage}
                          onPaginationPageChange={onPaginationPageChange}
                          currentPage={paginationContext.currentPage}
        /> : <Spinner color="#EC6110" display="block" size="50px"/>}
    </StyledTable>
  );
};

export default CurrencyList;
