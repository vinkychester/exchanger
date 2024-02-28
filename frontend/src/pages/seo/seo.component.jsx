import React, { useState } from "react";
import { useApolloClient } from "@apollo/react-hooks";
import Tabs, { TabPane } from "rc-tabs/es";

import Can from "../../components/can/can.component";
import Title from "../../components/title/title.component";
import ForbiddenPage from "../forbidden/forbidden.component";
import AdministrationContainer from "../../components/administration/administration.container";

import { StyledAdministrationWrapper } from "../../components/administration/styled-administration-page";
import { StyledContainer } from "../../components/styles/styled-container";

import { GET_USER_RBAC_DETAILS } from "../../graphql/queries/user.query";
import { seos } from "../../rbac-consts";

const SeoPage = () => {
  const discr = "seo";
  const client = useApolloClient();

  const { userRole } = client.readQuery({
    query: GET_USER_RBAC_DETAILS,
  });

  const [shouldRefetch, setShouldRefetch] = useState(0);

  return (
    <Can
      role={userRole}
      perform={seos.READ}
      yes={() => (
        <StyledContainer size="xl">
          <StyledAdministrationWrapper>
            <Title
              as="h1"
              title="СЕО-менедежры"
              className="administration-navigation-title"
            />
            <Tabs
              defaultActiveKey="active"
              tabPosition="top"
              className="default-tabs default-tabs-top"
            >
              <TabPane tab="Активные" key="active">
                <AdministrationContainer
                  discr={discr}
                  isBanned={false}
                  type={"A"}
                  setShouldRefetch={setShouldRefetch}
                  shouldRefetch={shouldRefetch}
                />
              </TabPane>
              <TabPane tab="Заблокированые" key="block">
                <AdministrationContainer
                  discr={discr}
                  isBanned={true}
                  type={"B"}
                  setShouldRefetch={setShouldRefetch}
                  shouldRefetch={shouldRefetch}
                />
              </TabPane>
            </Tabs>
          </StyledAdministrationWrapper>
        </StyledContainer>
      )}
      no={() => <ForbiddenPage />}
    />
  );
};

export default React.memo(SeoPage);
