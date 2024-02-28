import React, { createContext, useState } from "react";
import { useQuery, useApolloClient } from "@apollo/react-hooks";
import { Helmet } from "react-helmet-async";
import Tabs, { TabPane } from "rc-tabs";

import Can from "../../components/can/can.component";
import ForbiddenPage from "../forbidden/forbidden.component";
import PageSpinner from "../../components/spinner/page-spinner.component";
import AlertMessage from "../../components/alert/alert.component";
import Title from "../../components/title/title.component";
import AccountUserInformation from "../../components/account/account-user-information.component";
import AccountConfigSecurity from "../../components/account/account-config-security.component";
import AccountChangePassword from "../../components/account/account-change-password.component";

import { StyledContainer } from "../../components/styles/styled-container";
import { StyledAccountWrapper } from "./styled-account";

import {
  GET_ADMIN_ACCOUNT_DETAILS,
  GET_CLIENT_ACCOUNT_DETAILS,
  GET_MANAGER_ACCOUNT_DETAILS,
  GET_SEO_ACCOUNT_DETAILS,
} from "../../graphql/queries/account.query";
import { GET_USER_RBAC_DETAILS } from "../../graphql/queries/user.query";
import { account } from "../../rbac-consts";

export const UserAccountContext = createContext();

const Account = () => {
  const client = useApolloClient();

  const { userId, userRole } = client.readQuery({
    query: GET_USER_RBAC_DETAILS,
  });

  const [firstLogin, setFirstLogin] = useState(false);

  if (localStorage.getItem("first_login/api/clients/" + userId)) {
    setFirstLogin(true);
    localStorage.removeItem("first_login/api/clients/" + userId);
  }

  let activeTab =
    firstLogin && userRole === "client" ? "changePassword" : "personalData";

  const DETAIL_QUERIES = {
    GET_ADMIN_ACCOUNT_DETAILS,
    GET_MANAGER_ACCOUNT_DETAILS,
    GET_SEO_ACCOUNT_DETAILS,
    GET_CLIENT_ACCOUNT_DETAILS,
  };

  const { data, loading, error } = useQuery(
    DETAIL_QUERIES[`GET_${userRole.toUpperCase()}_ACCOUNT_DETAILS`],
    {
      variables: { id: `/api/${userRole}s/${userId}` },
      fetchPolicy: "network-only",
    }
  );

  if (loading) return <PageSpinner />;
  if (error) return <AlertMessage type="warning" message="Error" />;
  if (!data) return <AlertMessage type="warning" message="Not found" />;

  const user = data[userRole];

  return (
    <Can
      role={userRole}
      perform={account.READ}
      yes={() => (
        <StyledContainer>
          <Helmet>
            <title>Аккаунт - Coin24</title>
          </Helmet>
          <StyledAccountWrapper>
            <Title
              as="h1"
              title="Ваш аккаунт"
              description="Профиль"
              className="account-title"
            />
            <UserAccountContext.Provider value={{ user }}>
              <Tabs
                defaultActiveKey={activeTab}
                tabPosition="left"
                className="default-tabs default-tabs-left"
              >
                <TabPane tab="Персональные данные" key="personalData">
                  <AccountUserInformation />
                </TabPane>
                {userRole === "client" && (
                  <>
                    <TabPane tab="Смена пароля" key="changePassword">
                      <AccountChangePassword
                        firstLogin={firstLogin}
                        setFirstLogin={setFirstLogin}
                      />
                    </TabPane>
                    <TabPane tab="Настройки безопасности" key="configSecurity">
                      <AccountConfigSecurity />
                    </TabPane>
                  </>
                )}
              </Tabs>
            </UserAccountContext.Provider>
          </StyledAccountWrapper>
        </StyledContainer>
      )}
      no={() => <ForbiddenPage />}
    />
  );
};

export default React.memo(Account);
