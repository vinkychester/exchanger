import React, { useContext, useEffect, useState } from "react";
import { useApolloClient } from "@apollo/react-hooks";
import { NavLink, useHistory } from "react-router-dom";
import { Helmet } from "react-helmet-async";

import Can from "../../components/can/can.component";
import ForbiddenPage from "../forbidden/forbidden.component";
import Title from "../../components/title/title.component";
import NewsAdminContainer from "../../components/news/news-admin.container";

import { StyledContainer } from "../../components/styles/styled-container";
import { StyledButton } from "../../components/styles/styled-button";
import { StyledAdminNewsWrapper } from "../../components/news/styled-admin-news";

import { GET_USER_RBAC_DETAILS } from "../../graphql/queries/user.query";
import { posts } from "../../rbac-consts";

const NewsAdmin = () => {
  const client = useApolloClient();

  const { userRole } = client.readQuery({
    query: GET_USER_RBAC_DETAILS,
  });

  return (
    <Can
      role={userRole}
      perform={posts.PANEL_READ}
      yes={() => (
        <StyledContainer size="xl">
          <Helmet>
            <title>Список новостей - Coin24</title>
          </Helmet>
          <StyledAdminNewsWrapper>
            <Title as="h1" title="Статьи" className="admin-news-title" />
            <div className="admin-news-action">
              <StyledButton color="main" as={NavLink} to="/panel/news/create">
                Добавить статью
              </StyledButton>
            </div>
            <br />
            <NewsAdminContainer />
          </StyledAdminNewsWrapper>
        </StyledContainer>
      )}
      no={() => <ForbiddenPage />}
    />
  );
};

export default React.memo(NewsAdmin);
