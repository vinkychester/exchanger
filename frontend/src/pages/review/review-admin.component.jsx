import React, { createContext, useCallback, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useApolloClient } from "@apollo/react-hooks";
import { useHistory } from "react-router-dom";
import queryString from "query-string";

import Can from "../../components/can/can.component";
import ForbiddenPage from "../forbidden/forbidden.component";
import Title from "../../components/title/title.component";
import ReviewFilter from "../../components/review/review-admin-filter.component";
import ReviewAdminList from "../../components/review/review-admin-list.component";

import { StyledAdminReviewsWrapper } from "../../components/review/styled-admin-reviews";
import { StyledContainer } from "../../components/styles/styled-container";

import { GET_USER_RBAC_DETAILS } from "../../graphql/queries/user.query";
import { reviews } from "../../rbac-consts";

export const ReviewFilterContext = createContext();

const ReviewsAdmin = () => {
  const client = useApolloClient();

  let history = useHistory();
  let searchParams = queryString.parse(history.location.search);

  const { userRole } = client.readQuery({
    query: GET_USER_RBAC_DETAILS,
  });

  const [filter, setFilter] = useState(
    Object.fromEntries(
      Object.entries(searchParams).filter(([_, v]) => v != null && v !== "")
    )
  );
  const [totalCount, setTotalCount] = useState(0);

  const handleChangeFilter = useCallback(
    (name, value) => {
      setFilter((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    },
    [filter]
  );

  const handleClearFilter = useCallback(() => {
    setFilter({});
  }, [filter]);

  useEffect(() => {
    let filtered = Object.fromEntries(
      Object.entries(filter).filter(([_, v]) => v != null && v !== "")
    );
    history.replace({
      search: queryString.stringify({ ...filtered }),
    });
  }, [filter]);

  return (
    <Can
      role={userRole}
      perform={reviews.PANEL_READ}
      yes={() => (
        <StyledContainer size="xl">
          <Helmet>
            <title>Список отзывов - Coin24</title>
          </Helmet>
          <StyledAdminReviewsWrapper>
            <ReviewFilterContext.Provider
              value={{
                filter,
                handleChangeFilter,
                handleClearFilter,
                totalCount,
                setTotalCount,
              }}
            >
              <Title as="h1" title="Отзывы" className="admin-reviews-title" />
              <ReviewFilter />
              <ReviewAdminList />
            </ReviewFilterContext.Provider>
          </StyledAdminReviewsWrapper>
        </StyledContainer>
      )}
      no={() => <ForbiddenPage />}
    />
  );
};

export default React.memo(ReviewsAdmin);
