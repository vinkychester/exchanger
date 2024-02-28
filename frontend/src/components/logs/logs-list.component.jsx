import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import { useQuery } from "@apollo/react-hooks";
import queryString from "query-string";

import Spinner from "../spinner/spinner.component";
import AlertMessage from "../alert/alert.component";
import CustomPagination from "../pagination/pagination.component";
import LogsItem from "./logs-item.component";

import {
  StyledColHead,
  StyledTable,
  StyledTableBody,
  StyledTableHeader,
} from "../styles/styled-table";

import { GET_LOGS } from "../../graphql/queries/logs.query";
import { LogsFilterContext } from "../../pages/logs/logs.component";
import { convertDateToLocalDateTime } from "../../utils/datetime.util";

const LogsList = () => {
  let history = useHistory();

  const { filter, handleChangeFilter } = useContext(LogsFilterContext);
  const { date_gte, date_lte, page, itemsPerPage, ...props } = filter;

  const currentPage = page ? parseInt(page) : 1;

  const { data, loading, error } = useQuery(GET_LOGS, {
    variables: {
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
    handleChangeFilter("page", page);
    history.replace({
      search: queryString.stringify({ page, date_gte, date_lte, ...props }),
    });
  };

  if (loading) return <Spinner color="#EC6110" type="moonLoader" size="50px" />;
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
        <StyledTableHeader col="6" className="admin-logs-table__head">
          <StyledColHead className="admin-logs-table__role-head">
            Роль
          </StyledColHead>
          <StyledColHead className="admin-logs-table__user-head">
            E-mail
          </StyledColHead>
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

export default LogsList;
