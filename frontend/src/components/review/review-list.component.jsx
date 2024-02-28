import React, {useContext} from "react";
import {useQuery} from "@apollo/react-hooks";
import {useHistory} from "react-router-dom";

import Spinner from "../spinner/spinner.component";
import AlertMessage from "../alert/alert.component";
import CustomPagination from "../pagination/pagination.component";

import ReviewItem from "./review-item.component";

import {GET_PUBLISHED_REVIEWS} from "../../graphql/queries/review.query";
import {PaginationContext} from "../../pages/review/reviews.component";

const ReviewList = () => {

  const publish = true;

  let history = useHistory();
  const paginationContext = useContext(PaginationContext);

  const {data, loading, error} = useQuery(GET_PUBLISHED_REVIEWS, {
    variables: {
      page: paginationContext.currentPage,
      itemsPerPage: paginationContext.itemsPerPage,
      publish: publish
    },
    fetchPolicy: "network-only"
  });

  const onPaginationPageChange = (page) => {
    const url = new URL(window.location.href);
    url.searchParams.set("page", page.toString());

    history.push({
      pathname: url.pathname,
      search: url.search
    });
  };

  if (loading) return <Spinner color="#EC6110" type="moonLoader" size="50px" />;
  if (error) return <AlertMessage type="error" message={error.message} />;
  if (!data) return <AlertMessage type="warning" message="Not found." />;

  const {collection, paginationInfo} = data.reviews;

  if (!collection.length)
    return (
      <AlertMessage
        type="warning"
        message="Записи отсутствуют."
        // margin="15px 0 0"
      />
    );

  return (
    <>
      {collection.map(({...review}, key) => (
        <ReviewItem
          review={review}
          key={key}
        />
      ))}
      {!loading && data.reviews.paginationInfo.lastPage > 1 ? (
        <CustomPagination
          total={+paginationInfo.totalCount}
          pageSize={+paginationContext.itemsPerPage}
          onPaginationPageChange={onPaginationPageChange}
          currentPage={paginationContext.currentPage}
        />
      ) : <></>
      }
    </>
  );
};

export default ReviewList;
