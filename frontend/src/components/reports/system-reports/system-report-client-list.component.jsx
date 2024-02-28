import React, { useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import { useQuery } from "@apollo/react-hooks";
import queryString from "query-string";

import Spinner from "../../spinner/spinner.component";
import AlertMessage from "../../alert/alert.component";
import SystemReportClientItem from "./system-report-client-item.component";
import CustomPagination from "../../pagination/pagination.component";
import FragmentSpinner from "../../spinner/fragment-spinner.component";

import { StyledReportClientsWrapper } from "../styled-reports";

import { GET_STATISTIC_CLIENTS } from "../../../graphql/queries/clients.query";
import { SystemReportFilterContext } from "./system-report.container";
import {
  convertDateToTimestampStart,
  convertDateToTimestampEnd,
} from "../../../utils/datetime.util";

const SystemReportClientList = () => {
  let history = useHistory();
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const { filter } = useContext(SystemReportFilterContext);
  const { rdate_gte, rdate_lte, rpage, ritemsPerPage, ...props } = filter;

  const currentPage = rpage ? parseInt(rpage) : 1;

  const { data, loading, error, fetchMore } = useQuery(GET_STATISTIC_CLIENTS, {
    variables: {
      ...props,
      itemsPerPage: ritemsPerPage ? parseInt(ritemsPerPage) : 50,
      rpage: currentPage,
      rdate_gte: convertDateToTimestampStart(rdate_gte),
      rdate_lte: convertDateToTimestampEnd(rdate_lte),
    },
    fetchPolicy: "network-only",
  });

  const handlePaginationChange = (rpage) => {
    setIsLoadingMore(true);
    fetchMore({
      variables: { rpage },
      updateQuery: (prev, { fetchMoreResult }) => {
        setIsLoadingMore(false);
        if (!fetchMoreResult) return prev;
        return fetchMoreResult;
      },
    });
    // change current page
    // handleChangeFilter("page", page);
    history.replace({
      search: queryString.stringify({ rpage, rdate_gte, rdate_lte, ...props }),
    });
  };

  if (loading) return <Spinner color="#EC6110" type="moonLoader" size="35px" />;
  if (error) return <AlertMessage type="error" message={error.message} />;
  if (!data)
    return (
      <AlertMessage
        type="warning"
        message="Информация о статистике недоступна"
      />
    );

  const { collection, paginationInfo } = data.getStatisticClients;

  if (!collection.length)
    return (
      <AlertMessage
        type="warning"
        message="В заданном периоде информация отсутствует"
        margin="20px 0 0"
      />
    );

  const { totalCount } = paginationInfo;

  return (
    <React.Fragment>
      <StyledReportClientsWrapper>
        {isLoadingMore && <FragmentSpinner position="center" />}

        {collection &&
        collection.map(({ id, ...props }) => (
          <SystemReportClientItem key={id} id={id} {...props} />
        ))}
      </StyledReportClientsWrapper>
      <CustomPagination
        total={totalCount}
        pageSize={ritemsPerPage ? ritemsPerPage : 50}
        onPaginationPageChange={handlePaginationChange}
        currentPage={currentPage}
        loading={loading} //{loading || fetchLoading} - if need
      />
    </React.Fragment>

  );
};

export default SystemReportClientList;
