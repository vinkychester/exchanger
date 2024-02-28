import React from "react";
import { Helmet } from "react-helmet-async";
import Title from "../../components/title/title.component";
import AlertMessage from "../../components/alert/alert.component";

import { StyledContainer } from "../../components/styles/styled-container";

export const ClientManualPage = () => {
  return (
    <div style={{padding: "20px 0"}}>
      <StyledContainer>
        <Helmet>
          <title>Руководство пользователя · Coin24</title>
        </Helmet>
        <Title
          as="h1"
          title="Руководство пользователя"
          description="Справка"
        />
        <AlertMessage type="info" message="Coming soon..." />
      </StyledContainer>
    </div>
  );
};

export default React.memo(ClientManualPage);

