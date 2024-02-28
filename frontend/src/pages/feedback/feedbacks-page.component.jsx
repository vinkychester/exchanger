import React, { createContext, useCallback, useEffect, useState } from "react";
import { useApolloClient } from "@apollo/react-hooks";
import { Helmet } from "react-helmet-async";
import { useHistory } from "react-router-dom";
import queryString from "query-string";

import Can from "../../components/can/can.component";
import ForbiddenPage from "../forbidden/forbidden.component";
import Title from "../../components/title/title.component";
import FeedbackFilter from "../../components/feedback/feedback-filter.component";
import FeedbackList from "../../components/feedback/feedback-list.component";

import { StyledFeedbackWrapper } from "../../components/feedback/styled.feedback";
import { StyledContainer } from "../../components/styles/styled-container";

import { GET_USER_RBAC_DETAILS } from "../../graphql/queries/user.query";
import { feedbacks } from "../../rbac-consts";

export const FeedbackFilterContext = createContext();

const FeedbackPage = () => {
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
      perform={feedbacks.PANEL_READ}
      yes={() => (
        <StyledContainer size="xl">
          <Helmet>
            <title>Обратная ввязь - Coin24</title>
          </Helmet>
          <StyledFeedbackWrapper>
            <FeedbackFilterContext.Provider
              value={{
                filter,
                handleChangeFilter,
                handleClearFilter,
                totalCount,
                setTotalCount,
              }}
            >
              <Title
                as="h1"
                title="Обратная связь"
                className="feedback-title"
              />
              <FeedbackFilter />
              <FeedbackList />
            </FeedbackFilterContext.Provider>
          </StyledFeedbackWrapper>
        </StyledContainer>
      )}
      no={() => <ForbiddenPage />}
    />
  );
};

export default React.memo(FeedbackPage);
