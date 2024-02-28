import React from "react";
import { useApolloClient } from "@apollo/react-hooks";
import { Helmet } from "react-helmet-async";
import Tabs, { TabPane } from "rc-tabs";

import Can from "../../components/can/can.component";
import Title from "../../components/title/title.component";
import ForbiddenPage from "../forbidden/forbidden.component";
import CityContactsContainer from "../../components/city-contacts/city-contacs.container";
import CityContactFieldContainer from "../../components/city-contacs-field/city-contact-field.container";

import { StyledContainer } from "../../components/styles/styled-container";
import { StyledCityContactsWrapper } from "./styled-city-contacts";

import { GET_USER_RBAC_DETAILS } from "../../graphql/queries/user.query";
import { rolePage } from "../../rbac-consts";

const CityContactsPage = () => {
  const client = useApolloClient();

  const { userRole } = client.readQuery({
    query: GET_USER_RBAC_DETAILS,
  });

  return (
    <>
      <Can
        role={userRole}
        perform={rolePage.ADMINS}
        yes={() => (
          <StyledContainer size="xl">
            <Helmet>
              <title>Настройка контактов - Coin24</title>
            </Helmet>
            <StyledCityContactsWrapper>
              <Title
                as="h1"
                title="Настройка контактов"
                className="city-contact-title"
              />
              <Tabs
                defaultActiveKey="cityContacts"
                tabPosition="top"
                className="default-tabs default-tabs-top"
              >
                <TabPane tab="Мессенджеры" key="cityContactFieldContainer">
                  <CityContactFieldContainer />
                </TabPane>
                <TabPane tab="Контакты городов" key="cityContactsContainer">
                  <CityContactsContainer />
                </TabPane>
              </Tabs>
            </StyledCityContactsWrapper>
          </StyledContainer>
        )}
        no={() => <ForbiddenPage />}
      />
    </>
  );
};

export default React.memo(CityContactsPage);
