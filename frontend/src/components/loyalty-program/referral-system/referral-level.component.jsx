import React, { useState } from "react";
import { useApolloClient, useQuery } from "@apollo/react-hooks";
import AlertMessage from "../../alert/alert.component";
import { TimestampToDate } from "../../../utils/timestampToDate.utils";

import {
  StyledCol,
  StyledColHead,
  StyledRow,
  StyledTable,
  StyledTableBody,
  StyledTableHeader
} from "../../styles/styled-table";

import { GET_USER_RBAC_DETAILS } from "../../../graphql/queries/user.query";
import { GET_INVITED_USERS } from "../../../graphql/queries/referral-user-relation.query";

import Spinner from "../../spinner/spinner.component";
import CustomPagination from "../../pagination/pagination.component";
import { hideEmail } from "../../../utils/referral-program.utils";


const ClientReferrals = ({ level }) => {
  const client = useApolloClient();

  const { userId } = client.readQuery({
    query: GET_USER_RBAC_DETAILS,
  });

  const [page, setPage] = useState(1);

  const {data, loading, error, fetchMore} = useQuery(GET_INVITED_USERS, {
    variables: {
      clientId: userId,
      level: level,
      page: page,
      itemsPerPage: 50
    }});

  const handlePaginationChange = (page) => {
    setPage(page);
    fetchMore({
      variables: { page },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
        return fetchMoreResult;
      },
    });
  };

  if (loading) return <Spinner color="#EC6110" type="moonLoader" size="50px" />;
  if (error)
    return (
      <AlertMessage type="error" message={error.message} margin="15px 0" />
    );
  if (!data) return <AlertMessage type="warning" message="Нет ни одного реферала" />;

  const { collection, paginationInfo } = data.referralUserRelations;
  const { totalCount, itemsPerPage } = paginationInfo;

  if (collection.length === 0) return <AlertMessage type="warning" message="Нет ни одного реферала" />;

  return (
    <>
      <StyledTable className="referral-list-table">
        <StyledTableHeader
          col="3"
          className="referral-list-table__head"
        >
          <StyledColHead>Номер</StyledColHead>
          <StyledColHead>Дата регистрации</StyledColHead>
          <StyledColHead>E-mail</StyledColHead>
        </StyledTableHeader>
        <StyledTableBody>
          {collection && collection.map(({ id, invitedUser, date }, key) => (
            <StyledRow
              key={id}
              col="3"
              className="referral-list-table__row"
            >
              <StyledCol
                data-title="Номер"
                className="referral-list-table__number"
              >
                {(page -1) * itemsPerPage + key + 1}
              </StyledCol>
              <StyledCol
                data-title="Дата регистрации"
                className="referral-list-table__date"
              >
                {TimestampToDate(date)}
              </StyledCol>
              <StyledCol
                data-title="E-mail"
                className="referral-list-table__email"
              >
                {hideEmail(invitedUser.email)}
              </StyledCol>
            </StyledRow>
          ))}
        </StyledTableBody>
      </StyledTable>
      <CustomPagination
        total={totalCount}
        pageSize={50}
        onPaginationPageChange={handlePaginationChange}
        currentPage={page}
        loading={loading} //{loading || fetchLoading} - if need
      />
    </>
  );
};

export default ClientReferrals;
