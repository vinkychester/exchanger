import React, { useContext } from "react";
import { useQuery } from "@apollo/react-hooks";

import Spinner from "../../spinner/spinner.component";
import AlertMessage from "../../alert/alert.component";
import CustomPagination from "../../pagination/pagination.component";
import LogsItem from "../../logs/logs-item.component";

import { StyledColHead, StyledTable, StyledTableBody, StyledTableHeader } from "../../styles/styled-table";

import { GET_CLIENT_LOGS } from "../../../graphql/queries/logs.query";
import { convertDateToLocalDateTime } from "../../../utils/datetime.util";
import { ClientDetailsLogsFilterContext } from "./client-details-logs.component";

const ClientDetailsLogsList = ({ email }) => {
  const { filter, handleChangeFilter } = useContext(ClientDetailsLogsFilterContext);

  const { date_gte, date_lte, lpage, itemsPerPage, ...props } = filter;
  const currentPage = lpage ? parseInt(lpage) : 1;

  const { data, loading, error } = useQuery(GET_CLIENT_LOGS, {
    variables: {
      email,
      ...props,
      itemsPerPage: itemsPerPage ? +itemsPerPage : 50,
      page: currentPage,
      date_gte: date_gte ? convertDateToLocalDateTime(date_gte) : null,
      date_lte: date_lte ? convertDateToLocalDateTime(date_lte) : null,
    },
    // context: { fetchOptions: { signal }},
    fetchPolicy: "network-only",
  });

  const handlePaginationChange = (page) => {
    // change current page
    handleChangeFilter("lpage", page);
  };

  if (loading) return <Spinner color="#EC6110" type="moonLoader" size="20px" />;
  if (error) return <AlertMessage type="error" message={error.message} margin="15px 0" />;
  if (!data) return <></>;

  const { collection, paginationInfo } = data.logs;

  if (!collection.length)
    return (
      <AlertMessage type="info" message="Логи отсутствуют" margin="15px 0 0" />
    );

  const { totalCount } = paginationInfo;

  return (
    <>
      <StyledTable className="admin-logs-table">
        <StyledTableHeader col="4" className="admin-logs-table__head">
          <StyledColHead>Уровень</StyledColHead>
          <StyledColHead>Событие</StyledColHead>
          <StyledColHead>IP</StyledColHead>
          <StyledColHead>Дата</StyledColHead>
        </StyledTableHeader>
        <StyledTableBody>
          {collection &&
            collection.map(({ ...props }, key) => (
              <LogsItem key={key} {...props} />
            ))}
        </StyledTableBody>
      </StyledTable>
      <CustomPagination
        total={totalCount}
        pageSize={itemsPerPage ? itemsPerPage : 50}
        onPaginationPageChange={handlePaginationChange}
        currentPage={currentPage}
      />
    </>
  );
};

export default ClientDetailsLogsList;