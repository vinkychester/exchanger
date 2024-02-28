import React, { useContext } from "react";
import { useMutation, useQuery } from "@apollo/react-hooks";
import { useHistory } from "react-router-dom";
import queryString from "query-string";

import Spinner from "../spinner/spinner.component";
import CustomPagination from "../pagination/pagination.component";
import AlertMessage from "../alert/alert.component";
import NewsAdminItem from "./news-admin-item.component";

import {
  StyledColHead,
  StyledTable,
  StyledTableBody,
  StyledTableHeader,
} from "../styles/styled-table";

import {
  DELETE_POST_BY_ID,
  GET_POSTS_ADMIN_PANEL,
} from "../../graphql/queries/posts.query";
import { NewsFilterContext } from "./news-admin.container";
import {
  convertDateToTimestampEnd,
  convertDateToTimestampStart,
} from "../../utils/datetime.util";
import { closableNotificationWithClick } from "../notification/closable-notification-with-click.component";

const NewsAdminList = () => {
  let history = useHistory();
  const { handleChangeFilter, filter, setTotalCount } = useContext(NewsFilterContext);
  const { itemsPerPage } = filter;
  const { date_gte, date_lte, page, ...props } = filter;
  let currentPage = page ? parseInt(page) : 1;

  const { data, loading, error, fetchMore } = useQuery(GET_POSTS_ADMIN_PANEL, {
    variables: {
      ...props,
      itemsPerPage: itemsPerPage ? +itemsPerPage : 50,
      page: currentPage,
      date_gte: convertDateToTimestampStart(date_gte),
      date_lte: convertDateToTimestampEnd(date_lte),
    },
    fetchPolicy: "network-only",
  });

  const handlePaginationChange = (page) => {
    handleChangeFilter("page", page);
    history.replace({
      search: queryString.stringify({ page, date_gte, date_lte, ...props }),
    });
  };

  const [deletePost] = useMutation(DELETE_POST_BY_ID, {
      onCompleted: () => {
      closableNotificationWithClick(
        "Новость успешно удалена",
        "success"
      )}
    });

  if (loading) return <Spinner color="#EC6110" type="moonLoader" size="50px" />;
  if (error) return <AlertMessage type="error" message={error.message} />;
  if (!data) return <></>;

  const { collection, paginationInfo } = data.posts;

  if (!collection.length) {
    setTotalCount(0);
    return (
      <AlertMessage
        type="info"
        message="Статьи отсутствуют"
        margin="15px 0 0"
      />
    );
  }

  const { totalCount, lastPage } = paginationInfo;
  setTotalCount(totalCount);

  const getPageOnRemove = (currentPage) => {
    const a = itemsPerPage ? itemsPerPage : 50;
    let calculatedPage = Math.ceil((totalCount - 1) / a);
    if (currentPage > lastPage) currentPage = lastPage;
    else if (currentPage > calculatedPage) currentPage = calculatedPage;
    if (currentPage < 1) return 1;
    handleChangeFilter("page",currentPage);
    return currentPage;
  };

  const deletePostAction = (id) => {
    deletePost({
      variables: { id },
      refetchQueries: [
        {
          query: GET_POSTS_ADMIN_PANEL,
          variables: {
            ...props,
            itemsPerPage: itemsPerPage ? +itemsPerPage : 50,
            page: getPageOnRemove(currentPage),
            date_gte: convertDateToTimestampStart(date_gte),
            date_lte: convertDateToTimestampEnd(date_lte),
          },
        },
      ],
    });
  };
  return (
    <>
      <StyledTable className="admin-news-table">
        <StyledTableHeader col="6" className="admin-news-table__head">
          <StyledColHead>Публикация</StyledColHead>
          <StyledColHead>Заголовок</StyledColHead>
          <StyledColHead>Описание</StyledColHead>
          <StyledColHead>Дата</StyledColHead>
          <StyledColHead>Язык</StyledColHead>
          <StyledColHead />
        </StyledTableHeader>
        <StyledTableBody>
          {collection.map((post) => (
            <NewsAdminItem
              key={post.id}
              post={post}
              deletePostAction={deletePostAction}
            />
          ))}
        </StyledTableBody>
      </StyledTable>
      <CustomPagination
        total={totalCount}
        pageSize={itemsPerPage ? itemsPerPage : 50}
        onPaginationPageChange={handlePaginationChange}
        currentPage={currentPage}
        loading={loading}
      />
    </>
  );
};

export default NewsAdminList;
