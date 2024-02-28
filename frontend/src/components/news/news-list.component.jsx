import React, { useCallback, useContext, useEffect, useState } from "react";
import { useLazyQuery } from "@apollo/react-hooks";
import { useHistory } from "react-router-dom";
import queryString from "query-string";

import CustomPagination from "../pagination/pagination.component";
import AlertMessage from "../alert/alert.component";
import NewsItem from "./news-item.component";
import ClientsNewsFilter from "./clients-news-filter.component";
import NewsItemSkeleton from "./skeleton/news-item-skeleton";

import { StyledNewsContainer } from "./styled-news";

import { GET_POSTS_USER } from "../../graphql/queries/posts.query";

export const PaginationContext = React.createContext({
  currentPage: 1,
  itemsPerPage: 10,
});

const NewsList = () => {
  const history = useHistory();
  const searchParams = queryString.parse(history.location.search);
  const currentPage = parseInt(searchParams.page ?? 1);
  const [filter, setFilter] = useState(searchParams);

  const paginationContext = useContext(PaginationContext);
  const [executeSearch, { data, loading, error }] = useLazyQuery(
    GET_POSTS_USER,
    {
      fetchPolicy: "network-only",
    }
  );
  
  const [paginationInfo, setPaginationInfo] = useState({
    ...paginationContext,
    currentPage,
  });

  const onPaginationPageChange = useCallback(
    (page) => {
      setPaginationInfo((prevState) => ({
        ...prevState,
        currentPage: page,
      }));
      setFilter((prevState) => ({
        ...prevState,
        page,
      }));
    },
    [paginationInfo, setPaginationInfo, filter, setFilter]
  );

  const prepareParamsToQuery = (filter) => {
    let preparedParams = {};
    preparedParams.itemsPerPage = paginationInfo.itemsPerPage;

    if (filter.page) {
      preparedParams.page = parseInt(filter.page);
    }
    preparedParams.newsText = filter.text;
    return preparedParams;
  };

  useEffect(() => {
    history.replace({
      search: queryString.stringify(filter),
    });
    executeSearch({ variables: prepareParamsToQuery(filter) });
  }, [filter]);

  if (loading) return <NewsItemSkeleton/>;
  if (error) return <AlertMessage type="error" message={error} />;
  if (!data) return <AlertMessage type="warning" message="Статьи отсутствуют." />;

  const { collection, paginationInfo: pagination } = data.posts;

  return (
    <>
      <ClientsNewsFilter filter={filter} setFilter={setFilter} />
      <StyledNewsContainer>
        <NewsItem posts={collection} />
      </StyledNewsContainer>
      <CustomPagination
        total={pagination.totalCount}
        pageSize={paginationContext.itemsPerPage}
        onPaginationPageChange={onPaginationPageChange}
        currentPage={currentPage}
        loading={loading}
      />
    </>
  );
};

export default NewsList;
