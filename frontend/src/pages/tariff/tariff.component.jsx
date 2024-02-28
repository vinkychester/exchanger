import React from "react";
import { NavLink } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Title from "../../components/title/title.component";
import TariffList from "../../components/tariff/tariff-list.component";
import BreadcrumbItem from "../../components/breadcrumb/breadcrumb-item";
import Tabs, { TabPane } from "rc-tabs";

import { StyledContainer } from "../../components/styles/styled-container";
import { StyledTariffWrapper } from "./styled-tariff";
import { StyledBreadcrumb } from "../../components/styles/styled-breadcrumb";

const Tariff = () => {
  return (
    <StyledContainer>
      <Helmet>
        <title>Лимиты на обмен криптовалюты - Coin24</title>
        <meta
          name="description"
          content="Подробные тарифы на обмен криптовалюты"
        />
      </Helmet>
      <StyledTariffWrapper>
        <Title
          as="h1"
          title="Лимиты на обмен криптовалюты"
          description="Обмен"
        />
        <StyledBreadcrumb className="tariff-breadcrumb">
          <BreadcrumbItem
            as={NavLink}
            to="/"
            title="Главная"
          />
          <BreadcrumbItem
            as={NavLink}
            to="/rates"
            title="Текущие курсы"
          />
          <BreadcrumbItem
            as="span"
            title="Лимиты"
          />
        </StyledBreadcrumb>
        <Tabs
          efaultActiveKey="payment"
          tabPosition="top"
          className="default-tabs default-tabs-top"
        >
          <TabPane tab="Покупка" key="payment">
            <TariffList direction="payment" />
          </TabPane>
          <TabPane tab="Продажа" key="payout">
            <TariffList direction="payout" />
          </TabPane>
        </Tabs>
      </StyledTariffWrapper>
    </StyledContainer>
  );
};

export default React.memo(Tariff);