import React, { useContext } from "react";
import { useQuery } from "@apollo/react-hooks";
import { useHistory } from "react-router-dom";
import queryString from "query-string";

import Spinner from "../../spinner/spinner.component";
import AlertMessage from "../../alert/alert.component";
import CustomPagination from "../../pagination/pagination.component";
import TrafficReportsClientDetailsItem from "./traffic-reports-client-details-item.component";

import { StyledClientsList } from "../../client/styled-clients";

import { GET_CLIENTS_BY_TRAFFIC_ID } from "../../../graphql/queries/clients.query";
import { TrafficReportsClientDetailsContext } from "./traffic-reports-client-details-container.component";

const TrafficReportsClientDetailsList = ({ id }) => {
  let history = useHistory();

  const { filter, handleChangeFilter, setTotalCount } = useContext(TrafficReportsClientDetailsContext);
  const { page, itemsPerPage } = filter;

  const currentPage = page ? parseInt(page) : 1;

  const { data, loading, error, refetch } = useQuery(
    GET_CLIENTS_BY_TRAFFIC_ID,
    {
      variables: {
        trafficLink_id: id,
        ...filter,
        itemsPerPage: itemsPerPage ? parseInt(itemsPerPage) : 50,
        page: currentPage,
      },
      fetchPolicy: "network-only",
    }
  );

  const handlePaginationChange = (page) => {
    // change current page
    handleChangeFilter(`page`, page);
    history.replace({
      search: queryString.stringify({ page, ...filter }),
    });
  };

  if (loading) return <Spinner color="#EC6110" type="moonLoader" size="50px" />;
  if (error) return <AlertMessage type="error" message="Error" margin="15px 0" />;
  if (!data) return <AlertMessage type="error" message="Not found" margin="15px 0" />;

  const { collection, paginationInfo } = data.clients;

  if (!collection.length) {
    setTotalCount(0);
    return (
      <AlertMessage type="info" message="Нет клиентов" margin="15px 0 0" />
    );
  }

  const { totalCount } = paginationInfo;
  setTotalCount(totalCount);

  return (
    <>
      <StyledClientsList>
        {collection &&
          collection.map(({ ...props }, key) => (
            <TrafficReportsClientDetailsItem
              key={key}
              {...props}
            />
          ))}
      </StyledClientsList>
      <CustomPagination
        total={totalCount}
        pageSize={itemsPerPage ? parseInt(itemsPerPage) : 50}
        onPaginationPageChange={handlePaginationChange}
        currentPage={currentPage}
      />
    </>
  );
};

export default TrafficReportsClientDetailsList;
