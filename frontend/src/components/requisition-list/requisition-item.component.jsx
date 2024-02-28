import React from "react";
import { useApolloClient } from "@apollo/react-hooks";
import { NavLink, useHistory } from "react-router-dom";

import Can from "../can/can.component";
import RequisitionCity from "./requisition-city.component";

import { StyledButton } from "../styles/styled-button";
import { StyledDirectionType } from "../styles/styled-direction-type";
import { StyledRequisitionStatus } from "./styled-requisition";
import { StyledCol, StyledRow } from "../styles/styled-table";

import { GET_USER_RBAC_DETAILS } from "../../graphql/queries/user.query";
import { TimestampToDate } from "../../utils/timestampToDate.utils";
import { requisitionStatus } from "../../utils/requsition.status";
import { requisition } from "../../rbac-consts";
import { parseUuidIRI } from "../../utils/response";
import { CopyToClipboard } from "react-copy-to-clipboard/lib/Component";
import { closableNotificationWithClick } from "../notification/closable-notification-with-click.component";

const RequisitionItem = ({
  id,
  isSeen,
  pair,
  client,
  paymentAmount,
  payoutAmount,
  status,
  createdAt,
  manager,
  exchangePoint,
  endDate,
}) => {
  let history = useHistory();
  const clientApollo = useApolloClient();

  const { userRole } = clientApollo.readQuery({
    query: GET_USER_RBAC_DETAILS,
  });

  const { payment, payout } = pair;
  const { id: clientId, firstname, lastname, email } = client;

  let payoutAmountNew = payout.paymentSystem.tag === "CASH" && userRole === "client"
      ? payoutAmount.toString().split(".")[0]
      : payoutAmount;


  const showDetails = (e) => {
    if (e.target.tagName === "DIV") {
      history.push(`/panel/requisition-details/${parseUuidIRI(id)}`);
    }
  };

  return (
    <StyledRow
      scroll="auto"
      onClick={showDetails}
      col={userRole !== "client" ? "10" : "7"}
      className="requisition-table__row"
      title={`Перейти в детали заявки ${parseUuidIRI(id).split("-")[0]}`}
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
      <StyledCol data-title="Дата создания" className="requisition-table__date">
        {TimestampToDate(createdAt)}
      </StyledCol>
      <Can
        role={userRole}
        perform={requisition.DATE_INFO}
        yes={() => (
          <StyledCol
            data-title="Дата выполнения"
            className="requisition-table__end-date"
          >
            {endDate ? TimestampToDate(endDate) : <span>00.00.0000 --:--</span>}
          </StyledCol>
        )}
      />
      <Can
        role={userRole}
        perform={requisition.CLIENT_DETAILS}
        yes={() => (
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
                <span className="icon-copy" title="Скопировать имя и фамилию" />
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
                <span className="icon-copy" title="Скопировать e-mail" />
              </CopyToClipboard>
            </div>
          </StyledCol>
        )}
      />
      <StyledCol
        data-title="Платежная система"
        className="requisition-table__payment-system payment-system"
      >
        <div className="payment-system__name">{payment.paymentSystem.name}</div>
        <div className="payment-system__city">
          {exchangePoint === "bank" ? (
            "Безналичный расчет"
          ) : (
            <RequisitionCity exchangePoint={exchangePoint} />
          )}
        </div>
        <StyledDirectionType
          className="payment-system__type"
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
          <div className="amount__num">{payoutAmountNew}</div>
          <div className="amount__currency">{payout.currency.asset}</div>
        </div>
      </StyledCol>
      <Can
        role={userRole}
        perform={requisition.USER_INFO}
        yes={() => (
          <StyledCol
            data-title="Менеджер"
            className="requisition-table__manager user"
          >
            {exchangePoint === "bank" ? (
              <div className="user__empty">Безналичный расчет</div>
            ) : manager ? (
              <React.Fragment>
                <div className="user__name">
                  {manager.firstname} {manager.lastname}
                </div>
                <div className="user__email">{manager.email}</div>
              </React.Fragment>
            ) : (
              <div className="user__empty">Не назначен</div>
            )}
          </StyledCol>
        )}
      />
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

export default React.memo(RequisitionItem);
