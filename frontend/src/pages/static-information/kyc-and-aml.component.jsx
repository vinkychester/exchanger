import React from "react";
import Title from "../../components/title/title.component";
import StaticInfoNav from "../../components/static-information/static-info-navigation";
import { Helmet } from "react-helmet-async";
import AlertMessage from "../../components/alert/alert.component";

import { StyledContainer } from "../../components/styles/styled-container";
import {
  StaticInfoContent,
  StaticInfoGrid,
  StaticInfoWrapper
} from "../../components/static-information/styled-static-info";


const KycAndAml = () => {
  return (
    <StyledContainer>
      <Helmet>
        <title>KYC и AML политика компании - Coin24</title>
      </Helmet>
      <StaticInfoWrapper>
        <Title
          as="h1"
          title="KYC и AML политика компании"
          description="Инфо"
        />
        <StaticInfoGrid>
          <StaticInfoNav />
          <StaticInfoContent>
            <AlertMessage type="info" message="Coming soon..." />
          </StaticInfoContent>
        </StaticInfoGrid>
      </StaticInfoWrapper>
    </StyledContainer>
  );
};

export default React.memo(KycAndAml);
