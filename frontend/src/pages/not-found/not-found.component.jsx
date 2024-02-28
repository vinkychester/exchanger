import React from "react";
import { Helmet } from "react-helmet-async";

import { StyledNotFoundContent, StyledNotFoundWrapper } from "./styled-not-found";

const NotFoundComponent = ({ match }) => {
  return (
    <StyledNotFoundWrapper>
      <Helmet>
        <title>Ошибка 404 · Coin24</title>
        <meta
          name="robots"
          content="noindex"
        />
      </Helmet>
      <StyledNotFoundContent>
        <b>404.</b>
        <p>
          Запрошенный URL не найден.
        </p>
      </StyledNotFoundContent>
    </StyledNotFoundWrapper>
  );
};

export default React.memo(NotFoundComponent);
