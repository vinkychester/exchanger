import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import { useQuery } from "@apollo/react-hooks";
import queryString from "query-string";

import Spinner from "../spinner/spinner.component";
import AlertMessage from "../alert/alert.component";
import CustomPagination from "../pagination/pagination.component";
import ClientItem from "./client-item.component";

import { StyledClientsList } from "./styled-clients";

import { GET_CLIENTS } from "../../graphql/queries/clients.query";
import { ClientFilterContext } from "./client.container";
import { convertDateToTimestampEnd, convertDateToTimestampStart } from "../../utils/datetime.util";

const ClientList = () => {
  let history = useHistory();

  const { filter, sign, handleChangeFilter, setTotalCount } = useContext(ClientFilterContext);
  
  const object = Object.entries(filter).reduce((a, [k, v]) => (a[k.slice(1)] = v, a), {});
  const { page, date_gte, date_lte, isDeleted } = object;

  const currentPage = page ? parseInt(page) : 1;
  
  const { data, loading, error, refetch } = useQuery(GET_CLIENTS, {
    variables: {
      ...object,
      itemsPerPage: filter[`${sign}itemsPerPage`] ? +filter[`${sign}itemsPerPage`] : 50,
      page: currentPage,
      isBanned: sign === "b",
      isDeleted: isDeleted ? isDeleted === "true" :  null,
      date_gte: convertDateToTimestampStart(date_gte),
      date_lte: convertDateToTimestampEnd(date_lte),
    },
    // context: { fetchOptions: { signal }},
    fetchPolicy: "network-only",
  });

  const handlePaginationChange = (page) => {
    // change current page
    handleChangeFilter(`${sign}page`, page);
    history.replace({
      search: queryString.stringify({ [`${sign}page`]: page, ...filter }),
    });
  };

  const handleChange = () => {
    refetch();
  };

  if (loading) return <Spinner color="#EC6110" type="moonLoader" size="50px" />;
  if (error) return <AlertMessage type="error" message="Error" margin="15px 0"/>;
  if (!data) return <AlertMessage type="error" message="Not found" margin="15px 0"/>;

  const { collection, paginationInfo } = data.clients;

  if (!collection.length) {
    setTotalCount(0);
    return <AlertMessage type="info" message="Нет клиентов" margin="15px 0 0" />;
  }

  const { totalCount } = paginationInfo;
  setTotalCount(totalCount);

  return (
    <>
      <StyledClientsList>
        {collection &&
          collection.map(({ ...props }, key) => (
            <ClientItem key={key} {...props} refetch={refetch} handleChange={handleChange} />
          ))}
      </StyledClientsList>
      <CustomPagination
        total={totalCount}
        pageSize={filter[`${sign}itemsPerPage`] ? +filter[`${sign}itemsPerPage`] : 50}
        onPaginationPageChange={handlePaginationChange}
        currentPage={currentPage}
      />
    </>
  );
};

export default ClientList;