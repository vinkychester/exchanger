import React, { useContext, useState } from "react";

import { StyledReportClientsWrapper } from "../styled-reports";
import { useHistory } from "react-router-dom";
import { useQuery } from "@apollo/react-hooks";

import queryString from "query-string";
import Spinner from "../../spinner/spinner.component";
import AlertMessage from "../../alert/alert.component";
import CustomPagination from "../../pagination/pagination.component";
import ReferralReportItem from "./client-referral-report-item.component";

import { ReferralsFilterContext } from "./client-referral-report.container";
import { GET_CLIENT_BY_ID } from "../../../graphql/queries/clients.query";

const ClientReferralReportList = ({ setFirstname, setLastname }) => {
  const { handleChangeFilter, filter, match } = useContext(
    ReferralsFilterContext
  );
  let history = useHistory();
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const { page, ...props } = filter;
  const itemsPerPage = 10;
  let currentPage = page ? parseInt(page) : 1;

  const { data, loading, error, fetchMore } = useQuery(GET_CLIENT_BY_ID, {
    variables: {
      id: "/api/clients/" + match.params.id,
      itemsPerPage,
      page: currentPage,
      referralLevel: +match.params.referralLevel,
      ...props,
    },
    fetchPolicy: "network-only",
  });

  const handlePaginationChange = (page) => {
    setIsLoadingMore(true);
    fetchMore({
      variables: { page },
      updateQuery: (prev, { fetchMoreResult }) => {
        setIsLoadingMore(false);
        if (!fetchMoreResult) return prev;
        return fetchMoreResult;
      },
    });
    handleChangeFilter("page", page);
    history.replace({
      search: queryString.stringify({ page, ...props }),
    });
  };

  if (loading) return <Spinner color="#EC6110" type="moonLoader" size="50px" />;
  if (error) return <AlertMessage type="error" message={error.message} />;
  if (!data) return <></>;

  const { firstname, lastname } = data.client;
  setFirstname(firstname);
  setLastname(lastname);
  let { collection, paginationInfo } = data.client.referralUserRelations;

  collection = collection.filter((client) => client.invitedUser !== null);

  if (!collection.length)
    return (
      <AlertMessage
        type="info"
        message="Рефералы отсутствуют"
        margin="15px 0 0"
      />
    );

  const { totalCount } = paginationInfo;

  return (
    <>
      <StyledReportClientsWrapper>
        {collection &&
          collection.map((client) => (
            <ReferralReportItem
              key={client.invitedUser.id}
              invitedUser={client.invitedUser}
            />
          ))}
      </StyledReportClientsWrapper>
      <CustomPagination
        total={totalCount}
        pageSize={itemsPerPage}
        onPaginationPageChange={handlePaginationChange}
        currentPage={currentPage}
        loading={loading} //{loading || fetchLoading} - if need
      />
    </>
  );
};

export default ClientReferralReportList;
