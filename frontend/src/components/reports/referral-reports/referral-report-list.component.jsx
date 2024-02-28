import React, { useContext, useState } from "react";

import { StyledReportClientsWrapper } from "../styled-reports";
import Spinner from "../../spinner/spinner.component";
import AlertMessage from "../../alert/alert.component";
import ReferralReportItem from "./referral-report-item.component";
import { useQuery } from "@apollo/react-hooks";
import { GET_CLIENTS_LOYALTY_STATISTICS } from "../../../graphql/queries/clients.query";
import { useHistory } from "react-router-dom";
import queryString from "query-string";
import { ReferralReportFilterContext } from "./referral-reports.container";
import CustomPagination from "../../pagination/pagination.component";
import FragmentSpinner from "../../spinner/fragment-spinner.component";

const ReferralReportList = () => {
  let history = useHistory();
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const { filter } = useContext(ReferralReportFilterContext);
  const { lpage, pitemsPerPage, ...props } = filter;

  const currentPage = lpage ? parseInt(lpage) : 1;

  const { data, loading, error, fetchMore } =  useQuery(GET_CLIENTS_LOYALTY_STATISTICS, {
    variables: {
      ...props,
      itemsPerPage: pitemsPerPage ? +pitemsPerPage : 50,
      lpage: currentPage,
    },
    fetchPolicy: "network-only",
  })

  const handlePaginationChange = (lpage) => {
    setIsLoadingMore(true);
    fetchMore({
      variables: { lpage },
      updateQuery: (prev, { fetchMoreResult }) => {
        setIsLoadingMore(false);
        if (!fetchMoreResult) return prev;
        return fetchMoreResult;
      },
    });
    history.replace({
      search: queryString.stringify({ lpage, ...props }),
    });
  }

  if (loading) return <Spinner color="#EC6110" type="moonLoader" size="35px" />;
  if (error) return <AlertMessage type="error" message={error.message} margin="20px 0 0"/>;
  if (!data) return <AlertMessage type="warning" message="Информация о статистике недоступна" margin="20px 0 0"/>;

  const { collection, paginationInfo } = data.clients;

  if (!collection.length)
    return <AlertMessage type="info" message="Нет клиентов которые имеют рефералов или у клиентов нет балансов" margin="15px 0" />;

  const { totalCount } = paginationInfo;

  return (
    <React.Fragment>
      <StyledReportClientsWrapper>
        {isLoadingMore && <FragmentSpinner position="center" />}
        {collection && collection.map(client => (
          <ReferralReportItem
            key={client.id}
            client={client}
          />
        ))}
      </StyledReportClientsWrapper>
      <CustomPagination
        total={totalCount}
        pageSize={pitemsPerPage ? pitemsPerPage : 50}
        onPaginationPageChange={handlePaginationChange}
        currentPage={currentPage}
        loading={loading} //{loading || fetchLoading} - if need
      />
    </React.Fragment>
  );
};

export default ReferralReportList;
