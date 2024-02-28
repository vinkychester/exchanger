import React from "react";
import { NavLink, useHistory } from "react-router-dom";

import { StyledCol, StyledRow } from "../../styles/styled-table";
import { StyledDirectionType } from "../../styles/styled-direction-type";
import { StyledRequisitionStatus } from "../../requisition-list/styled-requisition";
import { StyledButton } from "../../styles/styled-button";

import { parseUuidIRI } from "../../../utils/response";
import { TimestampToDate } from "../../../utils/timestampToDate.utils";
import { requisitionStatus } from "../../../utils/requsition.status";
import { closableNotificationWithClick } from "../../notification/closable-notification-with-click.component";
import { CopyToClipboard } from "react-copy-to-clipboard/lib/Component";

const ManagerReportsRequisitionItem = ({
  id,
  pair,
  client,
  paymentAmount,
  payoutAmount,
  status,
  createdAt,
}) => {

  let history = useHistory();

  const { payment, payout } = pair;

  const { id: clientId, firstname, lastname, email } = client;

  const showDetails = (e) => {
    if (e.target.tagName === "DIV") {
      history.push(`/panel/requisition-details/${parseUuidIRI(id)}`);
    }
  };

  return (
    <StyledRow
      onClick={showDetails}
      col="11"
      className="requisition-table__row requisition-table_manager__row"
    >
      <StyledCol data-title="Номер" className="requisition-table__number">
        <CopyToClipboard
          text={parseUuidIRI(id).split("-")[0].toUpperCase()}
          onCopy={() => {
            closableNotificationWithClick("Скопировано", "success");
          }}
        >
          <p title="Скопировать">
            {parseUuidIRI(id).split("-")[0].toUpperCase()}
            <span className="icon-copy" />
          </p>
        </CopyToClipboard>
      </StyledCol>
      <StyledCol data-title="Дата" className="requisition-table__date">
        {TimestampToDate(createdAt)}
      </StyledCol>
      <StyledCol
        data-title="Клиент"
        className="requisition-table__client user"
      >
        <div className="user__name">
          <NavLink
            to={`/panel/clients/${parseUuidIRI(clientId)}`}
            title={`Просмотреть профиль клиента ${firstname} ${lastname}`}
          >
            {firstname} {lastname}
          </NavLink>
          <CopyToClipboard
            text={`${firstname} ${lastname}`}
            onCopy={() => {
              closableNotificationWithClick("Скопировано", "success");
            }}
          >
            <span className="icon-copy" title="Скопировать имя и фамилию"/>
          </CopyToClipboard>
        </div>
        <div className="user__email">
          {email}
          <CopyToClipboard
            text={email}
            onCopy={() => {
              closableNotificationWithClick("Скопировано", "success");
            }}
          >
            <span className="icon-copy" title="Скопировать e-mail"/>
          </CopyToClipboard>
        </div>
      </StyledCol>
      <StyledCol
        data-title="Платежная система"
        className="requisition-table__payment-system payment-system"
      >
        <div className="payment-system__name">{payment.paymentSystem.name}</div>
        <StyledDirectionType
          type={payment.currency.tag === "CRYPTO" ? "selling" : "purchase"}
        >
          {payment.currency.tag === "CRYPTO" ? "продажа" : "покупка"}
        </StyledDirectionType>
      </StyledCol>
      <StyledCol data-title="Сумма платежа" className="requisition-table__in ">
        <div className="amount">
          <div className="amount__num">{paymentAmount}</div>
          <div className="amount__currency">{payment.currency.asset}</div>
        </div>
      </StyledCol>
      <StyledCol
        data-title="Сумма к получению"
        className="requisition-table__out"
      >
        <div className="amount">
          <div className="amount__num">{payoutAmount}</div>
          <div className="amount__currency">{payout.currency.asset}</div>
        </div>
      </StyledCol>
      <StyledCol data-title="Статус" className="requisition-table__status">
        <StyledRequisitionStatus status={status}>
          {requisitionStatus(status)}
        </StyledRequisitionStatus>
      </StyledCol>
      <StyledCol data-title="Действие" className="requisition-table__active">
        <StyledButton
          to={`/panel/requisition-details/${parseUuidIRI(id)}`}
          as={NavLink}
          color="info"
          weight="normal"
        >
          Детали
        </StyledButton>
      </StyledCol>
    </StyledRow>
  );
};

export default ManagerReportsRequisitionItem;
