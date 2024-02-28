import React from "react";
import { Helmet } from "react-helmet-async";
import { useApolloClient } from "@apollo/react-hooks";

import Can from "../../components/can/can.component";
import ForbiddenPage from "../forbidden/forbidden.component";
import Title from "../../components/title/title.component";
import BankDetailsContainer from "../../components/bank-details/bank-details.container";

import { StyledContainer } from "../../components/styles/styled-container";
import { StyledBankDetailsWrapper } from "./styled-bank-details";

import { GET_USER_RBAC_DETAILS } from "../../graphql/queries/user.query";
import { bankDetails } from "../../rbac-consts";

const BankDetailsPage = () => {
  const client = useApolloClient();

  const { userRole } = client.readQuery({
    query: GET_USER_RBAC_DETAILS,
  });

  return (
    <Can
      role={userRole}
      perform={bankDetails.ACTIONS}
      yes={() => (
        <StyledContainer>
          <Helmet>
            <title>Реквизиты - Coin24</title>
          </Helmet>
          <StyledBankDetailsWrapper>
            <Title as="h1" title="Реквизиты" className="bank-details-title" />
            <BankDetailsContainer />
          </StyledBankDetailsWrapper>
        </StyledContainer>
      )}
      no={() => <ForbiddenPage />}
    />
  );
};

export default React.memo(BankDetailsPage);
