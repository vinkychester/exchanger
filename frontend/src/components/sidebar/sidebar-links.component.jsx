import React from "react";
import { useApolloClient } from "@apollo/react-hooks";
import { NavLink } from "react-router-dom";

import Can from "../can/can.component";
import SidebarItem from "./sidebar-itemet.component";

import { GET_USER_RBAC_DETAILS } from "../../graphql/queries/user.query";
import {
  cardVerification,
  payoutRequisitions,
  requisition,
  sidebar,
} from "../../rbac-consts";
import BadgeNotificationFeedback from "../badge-notifications/badge-notification-feedback.component";
import BadgeNotificationCreditCard from "../badge-notifications/badge-notification-credit-card.component";
import BadgeNotificationReview from "../badge-notifications/badge-notification-review.component";
import BadgeNotificationRequisition from "../badge-notifications/badge-notification-requisition.component";
import { StyledItemWithBadge } from "./styled-sidebar";
import BadgeNotificationReferralRequisitions from "../badge-notifications/badge-notification-referral-requisitions.component";

const SidebarLinks = ({ handleChange }) => {
  const client = useApolloClient();

  const { userRole } = client.readQuery({
    query: GET_USER_RBAC_DETAILS,
  });

  return (
    <>
      <Can
        role={userRole}
        perform={sidebar.REQUISITIONS}
        yes={() => (
          <StyledItemWithBadge>
            <SidebarItem
              as={NavLink}
              to="/panel/requisitions"
              icon="exchange"
              linkTitle="Заявки"
              handleChange={handleChange}
            />
            <Can
              role={userRole}
              perform={requisition.NOTIFICATION}
              yes={() => <BadgeNotificationRequisition />}
            />
          </StyledItemWithBadge>
        )}
      />
      <Can
        role={userRole}
        perform={sidebar.CURRENCIES}
        yes={() => (
          <SidebarItem
            as={NavLink}
            to="/panel/currencies"
            icon="bitcoin"
            linkTitle="Валюты"
            handleChange={handleChange}
          />
        )}
      />
      <Can
        role={userRole}
        perform={sidebar.PAYMENT_SETTINGS}
        yes={() => (
          <SidebarItem
            as={NavLink}
            to="/panel/payment-settings"
            icon="money-bill"
            linkTitle="Платежные системы"
            handleChange={handleChange}
          />
        )}
      />
      <Can
        role={userRole}
        perform={sidebar.LOYALTY_PROGRAM}
        yes={() => (
          <StyledItemWithBadge>
            <SidebarItem
              as={NavLink}
              to="/panel/loyalty-program"
              icon="handshake"
              linkTitle="Лояльность"
              handleChange={handleChange}
            />
            <Can
              role={userRole}
              perform={payoutRequisitions.NOTIFICATION}
              yes={() => <BadgeNotificationReferralRequisitions />}
            />
          </StyledItemWithBadge>
        )}
      />
      <Can
        role={userRole}
        perform={sidebar.BANK_DETAILS}
        yes={() => (
          <SidebarItem
            as={NavLink}
            to="/panel/bank-details"
            icon="money-check"
            linkTitle="Реквизиты"
            handleChange={handleChange}
          />
        )}
      />
      <Can
        role={userRole}
        perform={sidebar.CLIENTS}
        yes={() => (
          <SidebarItem
            as={NavLink}
            to="/panel/clients"
            icon="users"
            linkTitle="Клиенты"
            handleChange={handleChange}
          />
        )}
      />
      <Can
        role={userRole}
        perform={sidebar.MANAGERS}
        yes={() => (
          <SidebarItem
            as={NavLink}
            to="/panel/admins"
            icon="users-settings"
            linkTitle="Администрация"
            handleChange={handleChange}
          />
        )}
      />
      <Can
        role={userRole}
        perform={sidebar.CARD_VERIFICATION}
        yes={() => (
          <StyledItemWithBadge>
            <SidebarItem
              as={NavLink}
              to="/panel/card-verification"
              icon="credit-card"
              linkTitle="Верификация карт"
              handleChange={handleChange}
            />
            <Can
              role={userRole}
              perform={cardVerification.NOTIFICATION}
              yes={() => <BadgeNotificationCreditCard />}
            />
          </StyledItemWithBadge>
        )}
      />
      {/*<Can*/}
      {/*  role={userRole}*/}
      {/*  perform={sidebar.DOCUMENTS}*/}
      {/*  yes={() => (*/}
      {/*    <SidebarItem*/}
      {/*      as={NavLink}*/}
      {/*      to="/panel/documents"*/}
      {/*      icon="document"*/}
      {/*      linkTitle="Верификация документов"*/}
      {/*      handleChange={handleChange}*/}
      {/*    />*/}
      {/*  )}*/}
      {/*/>*/}
      <Can
        role={userRole}
        perform={sidebar.NEWS}
        yes={() => (
          <SidebarItem
            as={NavLink}
            to="/panel/news"
            icon="newspaper"
            linkTitle="Статьи"
            handleChange={handleChange}
          />
        )}
      />
      <Can
        role={userRole}
        perform={sidebar.REVIEWS}
        yes={() => (
          <StyledItemWithBadge>
            <SidebarItem
              as={NavLink}
              to="/panel/reviews"
              icon="comment-dots"
              linkTitle="Отзывы"
              handleChange={handleChange}
            />
            <BadgeNotificationReview />
          </StyledItemWithBadge>
        )}
      />
      <Can
        role={userRole}
        perform={sidebar.CITIES_DETAILS}
        yes={() => (
          <SidebarItem
            as={NavLink}
            to="/panel/city-details"
            icon="city"
            linkTitle="Города"
            handleChange={handleChange}
          />
        )}
      />
      <Can
        role={userRole}
        perform={sidebar.CITIES_CONTACTS}
        yes={() => (
          <SidebarItem
            as={NavLink}
            to="/panel/city-contacts"
            icon="phone"
            linkTitle="Контакты"
            handleChange={handleChange}
          />
        )}
      />
      <Can
        role={userRole}
        perform={sidebar.FEEDBACKS}
        yes={() => (
          <StyledItemWithBadge>
            <SidebarItem
              as={NavLink}
              to="/panel/feedbacks"
              icon="email"
              linkTitle="Обратная связь"
              handleChange={handleChange}
            />
            <BadgeNotificationFeedback />
          </StyledItemWithBadge>
        )}
      />
      <Can
        role={userRole}
        perform={sidebar.MAILING}
        yes={() => (
          <SidebarItem
            as={NavLink}
            to="/panel/mailing"
            icon="mails-all"
            linkTitle="Рассылка"
            handleChange={handleChange}
          />
        )}
      />
      <Can
        role={userRole}
        perform={sidebar.REPORTS}
        yes={() => (
          <SidebarItem
            as={NavLink}
            to="/panel/reports"
            icon="file-invoice-dollar"
            linkTitle="Отчеты"
            handleChange={handleChange}
          />
        )}
      />
      <Can
        role={userRole}
        perform={sidebar.LOGS}
        yes={() => (
          <SidebarItem
            as={NavLink}
            to="/panel/logs"
            icon="logs"
            linkTitle="Логи"
            handleChange={handleChange}
          />
        )}
      />
      {/*<Can
        role={userRole}
        perform={sidebar.MANUAL}
        yes={() => (
          <SidebarItem
            as={NavLink}
            to="/client-manual"
            icon="question"
            linkTitle="Справка"
            handleChange={handleChange}
          />
        )}
      />*/}
    </>
  );
};

export default SidebarLinks;
