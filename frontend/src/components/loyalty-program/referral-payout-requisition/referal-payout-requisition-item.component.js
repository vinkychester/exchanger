import React from "react";
import { TimestampToDate } from "../../../utils/timestampToDate.utils";
import { requisitionStatus, requisitionStatusConst } from "../../../utils/requsition.status";
import { StyledButton } from "../../styles/styled-button";
import { StyledCol, StyledRow } from "../../styles/styled-table";
import { StyledRequisitionStatus } from "../../requisition-list/styled-requisition";
import { parseIRI, parseUuidIRI } from "../../../utils/response";
import { NavLink } from "react-router-dom";
import { CopyToClipboard } from "react-copy-to-clipboard/lib/Component";
import { closableNotificationWithClick } from "../../notification/closable-notification-with-click.component";

const ReferralPayoutRequisitionItem = ({ requisition, setVisible, setAction }) => {

  const showModal = (id, status) => {
    setAction({ id, status });
    setVisible(true);
  };

  return (

    <StyledRow scroll="auto" col="9" className="referral-payout-table__row">
      <StyledCol data-title="Номер" className="referral-payout-table__number">
        {parseIRI(requisition.id)}
      </StyledCol>
      <StyledCol data-title="Клиент" className="referral-payout-table__client client">
        <div className="client__name">
          <NavLink
            to={`/panel/clients/${parseUuidIRI(requisition.client.id)}`}
            title={`Просмотреть профиль клиента ${requisition.client.lastname} ${requisition.client.firstname}`}
          >
            {requisition.client.lastname} {requisition.client.firstname}
          </NavLink>

        </div>
        <div className="client__email">
          {requisition.client.email}
        </div>
      </StyledCol>
      <StyledCol
        data-title="Дата"
        className="referral-payout-table__date"
      >
        {TimestampToDate(requisition.createdAt)}
      </StyledCol>
      <StyledCol
        data-title="Сума"
        className="referral-payout-table__amount"
      >
        {requisition.amount} USDT
      </StyledCol>
      <StyledCol
        data-title="Кошелек"
        className="referral-payout-table__wallet"
      >
        <div className="requisition-wallet">
          <CopyToClipboard
            text={requisition.wallet}
            onCopy={() => {
              closableNotificationWithClick("Скопировано", "success");
            }}
          >
            <p>
              {requisition.wallet}
              <span className="icon-copy" title="Скопировать" />
            </p>
          </CopyToClipboard>
        </div>
      </StyledCol>
      <StyledCol
        data-title="Платежная система"
        className="referral-payout-table__usdt-type"
      >
        {requisition.usdtType}
      </StyledCol>
      <StyledCol
        data-title="Комментарий"
        className="referral-payout-table__message"
      >
        <div className="requisition-message">
          {requisition.commentary === null || requisition.commentary.length === 0 ? '-' : requisition.commentary}
        </div>
      </StyledCol>
      <StyledCol
        data-title="Статус"
        className="referral-payout-table__status"
      >
        <StyledRequisitionStatus status={requisition.status}>
          {requisitionStatus(requisition.status)}
        </StyledRequisitionStatus>
      </StyledCol>
      <StyledCol data-title="Действие" className="referral-payout-table__action">
        {requisition.status === requisitionStatusConst.NEW &&
        <>
          <StyledButton
            color="danger"
            weight="normal"
            onClick={() => showModal(requisition.id, requisitionStatusConst.CANCELED)}
          >
            Отклонить
          </StyledButton>
          <StyledButton
            color="success"
            weight="normal"
            onClick={() => showModal(requisition.id, requisitionStatusConst.FINISHED)}
          >
            Одобрить
          </StyledButton>
        </>}
      </StyledCol>
    </StyledRow>
  );

};

export default ReferralPayoutRequisitionItem;
