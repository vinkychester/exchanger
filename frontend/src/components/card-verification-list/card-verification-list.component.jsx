import React, { useContext } from "react";
import { useQuery, useApolloClient } from "@apollo/react-hooks";

import Can from "../../components/can/can.component";
import Spinner from "../spinner/spinner.component";
import AlertMessage from "../alert/alert.component";
import CustomPagination from "../pagination/pagination.component";
import CardVerificationItem from "./card-verification-item.component";

import { StyledColHead, StyledTable, StyledTableBody, StyledTableHeader } from "../styles/styled-table";

import { GET_USER_RBAC_DETAILS } from "../../graphql/queries/user.query";
import { GET_CREDIT_CARDS } from "../../graphql/queries/credit-card.query";
import { CardVerificationContext } from "../../pages/card-verification/card-verification.component";
import { convertDateToTimestampEnd, convertDateToTimestampStart } from "../../utils/datetime.util";
import { cardVerification } from "../../rbac-consts";

const CardVerificationList = () => {
  let permissions = {};
  const client = useApolloClient();

  const { userId, userRole } = client.readQuery({
    query: GET_USER_RBAC_DETAILS,
  });

  const { filter, currentPage, handleChangeFilter, setTotalCount } = useContext(CardVerificationContext);
  const { itemsPerPage } = filter;
  
  if ("client" === userRole) permissions = { client_id: userId };

  const { date_gte, date_lte, ...props } = filter;

  const { data, loading, error } = useQuery(GET_CREDIT_CARDS, {
    variables: {
      ...props,
      itemsPerPage: itemsPerPage ? +itemsPerPage : 50,
      page: currentPage,
      date_gte: convertDateToTimestampStart(date_gte),
      date_lte: convertDateToTimestampEnd(date_lte),
      ...permissions,
    },
    fetchPolicy: "network-only",
  });

  const handlePaginationChange = (page) => {
    // change current page
    handleChangeFilter("page", page);
  };

  if (loading) return <Spinner color="#EC6110" type="moonLoader" size="50px" />;
  if (error) return <AlertMessage type="error" message={error} />;
  if (!data) return <AlertMessage type="warning" message="Not found." />;

  const { collection, paginationInfo } = data.creditCards;

  if (!collection.length)
    return (
      <AlertMessage type="info" message="Нет карт на проверку" margin="15px 0" />
    );

  const { totalCount } = paginationInfo;
  setTotalCount(totalCount);

  return (
    <>
      <StyledTable className="verification-card-table">
        <StyledTableHeader className="verification-card-table__head">
          <StyledColHead>Дата</StyledColHead>
          <Can
            role={userRole}
            perform={cardVerification.CLIENT_DETAILS}
            yes={() => <StyledColHead>Клиент</StyledColHead>}
          />
          <StyledColHead>Номер карты</StyledColHead>
          <StyledColHead>Срок действия карты</StyledColHead>
          <StyledColHead>Статус</StyledColHead>
          <StyledColHead />
        </StyledTableHeader>
        <StyledTableBody>
          {collection &&
            collection.map(({ id, ...props }) => (
              <CardVerificationItem key={id} id={id} {...props} />
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

export default CardVerificationList;
