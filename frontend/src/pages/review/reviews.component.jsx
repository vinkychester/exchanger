import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useQuery, useApolloClient } from "@apollo/react-hooks";

import Can from "../../components/can/can.component";
import Title from "../../components/title/title.component";
import ReviewCreate from "../../components/review/review-create.component";
import ReviewList from "../../components/review/review-list.component";
import ReviewsFromInternet from "../../components/review/review-internet.component";

import { StyledContainer } from "../../components/styles/styled-container";
import {
  StyledReviewsBody,
  StyledReviewsSite,
  StyledReviewsWrapper,
} from "../../components/review/styled-reviews";

import { GET_USER_RBAC_DETAILS } from "../../graphql/queries/user.query";
import { reviews } from "../../rbac-consts";

export const PaginationContext = React.createContext({
  currentPage: 1,
  itemsPerPage: 10,
});

const Reviews = () => {
  const client = useApolloClient();

  const { userRole } = client.readQuery({
    query: GET_USER_RBAC_DETAILS,
  });

  let history = useHistory();
  let searchParams = new URLSearchParams(history.location.search);
  let currentPage = parseInt(searchParams.get("page") ?? 1);

  const paginationContext = useContext(PaginationContext);

  const [paginationInfo, setPaginationInfo] = useState({
    ...paginationContext,
    currentPage,
  });

  useEffect(() => {
    setPaginationInfo({ ...paginationContext, currentPage });
  }, [currentPage]);

  return (
    <StyledContainer>
      <Helmet>
        <title>Отзывы - Coin24</title>
        <meta
          name="description"
          content="Здесь Вы можете оставить свой отзыв о работе автоматического обменника крипты coin24.com.ua"
        />
      </Helmet>
      <StyledReviewsWrapper>
        <PaginationContext.Provider value={paginationInfo}>
          <Title
            as="h1"
            title="Отзывы"
            description="О нас пишут"
            className="reviews-title"
          />
          <StyledReviewsBody>
            <StyledReviewsSite className="reviews-site">
              <Can
                role={userRole}
                perform={reviews.CREATE}
                yes={() => <ReviewCreate />}
              />
              <div className="reviews-site__content">
                <ReviewList />
              </div>
            </StyledReviewsSite>
            <ReviewsFromInternet />
          </StyledReviewsBody>
        </PaginationContext.Provider>
      </StyledReviewsWrapper>
    </StyledContainer>
  );
};

export default React.memo(Reviews);
