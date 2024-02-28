import React, { useContext } from "react";
import { useQuery } from "@apollo/react-hooks";

import Spinner from "../../spinner/spinner.component";
import AlertMessage from "../../alert/alert.component";
import CustomPagination from "../../pagination/pagination.component";
import CardVerificationItem from "../../card-verification-list/card-verification-item.component";

import { StyledColHead, StyledTable, StyledTableBody, StyledTableHeader } from "../../styles/styled-table";

import { GET_CLIENT_CREDIT_CARDS } from "../../../graphql/queries/credit-card.query";
import { ClientDetailsCardContext } from "./client-details-credit.component";
import { convertDateToTimestampEnd, convertDateToTimestampStart } from "../../../utils/datetime.util";

const ClientDetailsCreditList = ({ id }) => {
  const { filter, handleChangeFilter } = useContext(ClientDetailsCardContext);

  const object = Object.entries(filter).reduce((a, [k, v]) => (a[k.slice(1)] = v, a), {});
  const { date_gte, date_lte, page, ...props } = object;

  const itemsPerPage = 3;
  const currentPage = page ? parseInt(page) : 1;

  const { data, loading, error } = useQuery(GET_CLIENT_CREDIT_CARDS, {
    variables: {
      itemsPerPage,
      page: currentPage,
      client_id: id,
      date_gte: convertDateToTimestampStart(date_gte),
      date_lte: convertDateToTimestampEnd(date_lte),
      ...props,
    },
    fetchPolicy: "network-only",
  });

  const handlePaginationChange = (page) => {
    // change current page
    handleChangeFilter("cpage", page);
  };

  if (loading) return <Spinner color="#EC6110" type="moonLoader" size="20px" />;
  if (error) return <AlertMessage type="error" message={error.message} margin="15px 0" />;
  if (!data) return <></>;

  const { collection, paginationInfo } = data.creditCards;

  if (!collection.length)
    return (
      <AlertMessage type="info" message="Нет реквизитов." margin="15px 0 0" />
    );

  const { totalCount } = paginationInfo;

  return (
    <>
      <StyledTable className="verification-card-table">
        <StyledTableHeader className="verification-card-table__head">
          <StyledColHead>Дата</StyledColHead>
          <StyledColHead>Номер карты</StyledColHead>
          <StyledColHead>Срок действия карты</StyledColHead>
          <StyledColHead>Статус</StyledColHead>
          <StyledColHead />
        </StyledTableHeader>
        <StyledTableBody>
          {collection &&
            collection.map(({ ...props }, key) => (
              <CardVerificationItem key={key} {...props} />
            ))}
        </StyledTableBody>
      </StyledTable>
      <CustomPagination
        total={totalCount}
        pageSize={itemsPerPage}
        onPaginationPageChange={handlePaginationChange}
        currentPage={currentPage}
      />
    </>
  );
};

export default ClientDetailsCreditList;