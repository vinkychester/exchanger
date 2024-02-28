import React, { useState } from "react";
import { useApolloClient } from "@apollo/react-hooks";
import Tabs, { TabPane } from "rc-tabs/es";

import Title from "../../components/title/title.component";
import Can from "../../components/can/can.component";
import ForbiddenPage from "../forbidden/forbidden.component";
import AdministrationContainer from "../../components/administration/administration.container";

import { StyledAdministrationWrapper } from "../../components/administration/styled-administration-page";
import { StyledContainer } from "../../components/styles/styled-container";

import { GET_USER_RBAC_DETAILS } from "../../graphql/queries/user.query";
import { admins } from "../../rbac-consts";

const AdminPage = () => {
  const discr = "admin";
  const client = useApolloClient();

  const { userRole } = client.readQuery({
    query: GET_USER_RBAC_DETAILS,
  });

  const [shouldRefetch, setShouldRefetch] = useState(0);

  return (
    <Can
      role={userRole}
      perform={admins.READ}
      yes={() => (
        <StyledContainer size="xl">
          <StyledAdministrationWrapper>
            <Title
              as="h1"
              title="Администраторы"
              className="administration-navigation-title"
            />
            <Tabs
              defaultActiveKey="activeClients"
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

export default React.memo(AdminPage);
