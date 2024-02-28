import React, { useCallback, useContext, useState } from "react";
import ReviewAdminItem from "./review-admin-item.component";
import Spinner from "../spinner/spinner.component";
import AlertMessage from "../alert/alert.component";
import { useMutation, useQuery } from "@apollo/react-hooks";
import { ReviewFilterContext } from "../../pages/review/review-admin.component";

import { StyledColHead, StyledTable, StyledTableBody, StyledTableHeader } from "../styles/styled-table";
import { DELETE_REVIEW_BY_ID } from "../../graphql/mutations/review.mutation";
import { useHistory } from "react-router-dom";
import { GET_ALL_REVIEWS_FILTER } from "../../graphql/queries/review.query";
import {
  convertDateToTimestampEnd,
  convertDateToTimestampStart
} from "../../utils/datetime.util";
import queryString from "query-string";
import FragmentSpinner from "../spinner/fragment-spinner.component";
import CustomPagination from "../pagination/pagination.component";

const ReviewAdminList = () => {

  let history = useHistory();
  const { handleChangeFilter, filter,setTotalCount } = useContext(ReviewFilterContext);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const { itemsPerPage } = filter;
  const { date_gte, date_lte, page, ...props } = filter;
  const currentPage = page ? parseInt(page) : 1;
  const { data, loadingData, error, fetchMore } = useQuery(GET_ALL_REVIEWS_FILTER,
    {
      variables: {
        ...props,
        itemsPerPage: itemsPerPage ? +itemsPerPage : 50,
        page: currentPage,
        date_gte: convertDateToTimestampStart(date_gte),
        date_lte: convertDateToTimestampEnd(date_lte),
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
      }
    });
    handleChangeFilter("page", page);
    history.replace({
      search: queryString.stringify({ date_gte, date_lte, page, ...props })
    });
  };

  const [deleteReview] = useMutation(DELETE_REVIEW_BY_ID, {
    refetchQueries: () => [{
      query: GET_ALL_REVIEWS_FILTER,
      variables: {
        ...props,
        itemsPerPage: itemsPerPage ? +itemsPerPage : 50,
        page: getPageOnRemove(currentPage),
        date_gte: convertDateToTimestampStart(date_gte),
        date_lte: convertDateToTimestampEnd(date_lte),
      }
    }]
  });
  //
  const deleteReviewAction = useCallback(
    (id) => {
      deleteReview({
        variables: { id }
      });
    }, []);
  if (loadingData || !data) return <Spinner color="#EC6110" type="moonLoader" size="50px" />;
  if (error) return <AlertMessage type="error" message={error} />;
  if (!data) return <AlertMessage type="info" message="Нет отзывов." />;
  const { collection, paginationInfo } = data.reviews;
  if (!collection.length) {
    setTotalCount(0);
    return <AlertMessage type="info" message="Нет отзывов" margin="15px 0 0" />;
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
      <StyledTable className="admin-reviews-table">
        {isLoadingMore && <FragmentSpinner position="center" />}
        <StyledTableHeader col="5" className="admin-reviews-table__head">
          <StyledColHead>Публикация</StyledColHead>
          <StyledColHead>Дата</StyledColHead>
          <StyledColHead>Пользователь</StyledColHead>
          <StyledColHead>Текст</StyledColHead>
          <StyledColHead />
        </StyledTableHeader>
        <StyledTableBody>
          {collection.map(({ ...review }, key) => (
            <ReviewAdminItem review={review} key={key} deleteReviewAction={deleteReviewAction} />
          ))}
        </StyledTableBody>
      </StyledTable>
      <CustomPagination
        total={totalCount}
        pageSize={itemsPerPage ? itemsPerPage : 50}
        onPaginationPageChange={handlePaginationChange}
        currentPage={currentPage}
        loading={loadingData} //{loading || fetchLoading} - if need
      />
    </>
  );
};

export default ReviewAdminList;
