import React, { useCallback, useContext, useEffect, useState } from "react";
import { FeedbackFilterContext } from "../../pages/feedback/feedbacks-page.component";
import { useMutation, useQuery, useApolloClient } from "@apollo/react-hooks";
import {
  UPDATE_DELETE_FEEDBACK_MESSAGE_BY_ID,
  DELETE_FEEDBACK_MESSAGE_BY_ID
} from "../../graphql/mutations/feedback.mutation";
import Spinner from "../spinner/spinner.component";
import AlertMessage from "../alert/alert.component";
import FeedbackItem from "./feedback-item.component";
import { feedbackStatusConst } from "../../utils/feedback-status";

import { StyledColHead, StyledTable, StyledTableBody, StyledTableHeader } from "../styles/styled-table";
import { useHistory } from "react-router-dom";
import { GET_USER_RBAC_DETAILS } from "../../graphql/queries/user.query";
import { GET_ALL_FEEDBACK_MESSAGE } from "../../graphql/queries/feedback.query";
import {
  convertDateToTimestampEnd,
  convertDateToTimestampStart
} from "../../utils/datetime.util";
import queryString from "query-string";
import CustomPagination from "../pagination/pagination.component";
import FragmentSpinner from "../spinner/fragment-spinner.component";

const FeedbackList = () => {
  let history = useHistory();
  const client = useApolloClient();

  const { managerCity } = client.readQuery({
    query: GET_USER_RBAC_DETAILS,
  });

  const [allowedVariables, setAllowedVariables] = useState({
    orderDate: "ASC",
    orderStatus:"ASC",
    deleted: false,
    citySearch: managerCity
  });
  const { handleChangeFilter, filter, setTotalCount } = useContext(FeedbackFilterContext);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const { date_gte, date_lte, page, itemsPerPage, ...props } = filter;
  const currentPage = page ? parseInt(page) : 1;

  useEffect(() => {
    switch (filter.status) {
      case 'deleted':
        setAllowedVariables((prevState) =>({
          ...prevState,
          deleted: true,
        }));
        break;
      default:
        setAllowedVariables((prevState) =>({
          ...prevState,
          deleted: false,
        }));
        break;
    }
  }, [filter.status]);

  const { data, loading, error, fetchMore } = useQuery(GET_ALL_FEEDBACK_MESSAGE,
    {
      variables: {
        ...props,
        itemsPerPage: itemsPerPage ? +itemsPerPage : 50,
        page: currentPage,
        date_gte: convertDateToTimestampStart(date_gte),
        date_lte: convertDateToTimestampEnd(date_lte),
        ...allowedVariables,
      },
      fetchPolicy: "network-only"
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
      search: queryString.stringify({ date_gte, date_lte, page, ...props  }),
    });
  };
  
  const [deleteFeedbackMessageEnd] = useMutation(DELETE_FEEDBACK_MESSAGE_BY_ID, {
    refetchQueries: () => [{
      query: GET_ALL_FEEDBACK_MESSAGE,
      variables: {
        ...props,
        itemsPerPage: itemsPerPage ? +itemsPerPage : 50,
        page: getPageOnRemove(currentPage),
        date_gte: convertDateToTimestampStart(date_gte),
        date_lte: convertDateToTimestampEnd(date_lte),
        ...allowedVariables,
      }
    }]
  });

  const [deleteFeedbackMessage] = useMutation(UPDATE_DELETE_FEEDBACK_MESSAGE_BY_ID, {
    refetchQueries: () => [{
      query: GET_ALL_FEEDBACK_MESSAGE,
      variables: {
        ...props,
        itemsPerPage: itemsPerPage ? +itemsPerPage : 50,
        page: getPageOnRemove(currentPage),
        date_gte: convertDateToTimestampStart(date_gte),
        date_lte: convertDateToTimestampEnd(date_lte),
        ...allowedVariables,
      }
    }]
  });

  const deleteFeedbackMessageAction = useCallback(
    (feedback) => {
      if (feedback.status === feedbackStatusConst.DELETED) {
        deleteFeedbackMessageEnd({
          variables: { id: feedback.id},
        });
      } else {
        deleteFeedbackMessage({
          variables: { id: feedback.id, deleted: true, status: feedbackStatusConst.DELETED },
        });
      }
    }, []);

  if (loading || !data) return <Spinner color="#EC6110" type="moonLoader" size="50px" />;
  if (error) return <AlertMessage type="error" message={error} />;
  if (!data) return <AlertMessage type="info" message="Нет тикетов." />;

  const { collection, paginationInfo } = data.feedbackMessages;

  if (!collection.length) {
    setTotalCount(0);
    return <AlertMessage type="info" message="Нет тикетов" margin="15px 0 0" />;
  }

  const { totalCount, lastPage } = paginationInfo;
  setTotalCount(totalCount);

  const getPageOnRemove = (currentPage) => {
    const a = itemsPerPage ? itemsPerPage : 50;
    let calculatedPage = Math.ceil((totalCount - 1) / a);
    if (currentPage > lastPage) {
      currentPage = lastPage;
    } else if (currentPage > calculatedPage) {
      currentPage = calculatedPage;
    }
    if (currentPage < 1) return 1;
    handleChangeFilter("page", currentPage);
    return currentPage;
  };

  return (
    <>
      <StyledTable className="feedback-table">
        {isLoadingMore && <FragmentSpinner position="center" />}
        <StyledTableHeader col="6" className="feedback-table__head">
          <StyledColHead>Пользователь</StyledColHead>
          <StyledColHead>Дата</StyledColHead>
          <StyledColHead>Статус</StyledColHead>
          <StyledColHead>Тип</StyledColHead>
          <StyledColHead>Город</StyledColHead>
          <StyledColHead />
        </StyledTableHeader>
        <StyledTableBody>
          {collection.map(({ ...feedback }, key) => (
            <FeedbackItem feedback={feedback} key={key} deleteFeedbackMessageAction={deleteFeedbackMessageAction} />
          ))}
        </StyledTableBody>
      </StyledTable>
      <CustomPagination
        total={totalCount}
        pageSize={itemsPerPage ? itemsPerPage : 50}
        onPaginationPageChange={handlePaginationChange}
        currentPage={currentPage}
        loading={loading} //{loading || fetchLoading} - if need
      />
    </>
  );
};

export default FeedbackList;
