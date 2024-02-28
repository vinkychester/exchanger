import React from "react";
import { TimestampToDate } from "../../../utils/timestampToDate.utils";
import { requisitionStatus, requisitionStatusConst } from "../../../utils/requsition.status";
import { StyledButton } from "../../styles/styled-button";
import { StyledCol, StyledRow } from "../../styles/styled-table";
import { StyledRequisitionStatus } from "../../requisition/styled-requisition";
import { parseIRI } from "../../../utils/response";

const ReferralPayoutRequisitionItem = ({ requisition, setVisible, setAction }) => {
  const showModal = (id, status) => {
    setAction({ id, status });
    setVisible(true);
  };

  return (
    <StyledRow col="8" className="referral-payout-table__row">
      <StyledCol data-title="Номер" className="referral-payout-table__number">
        {parseIRI(requisition.id)}
      </StyledCol>
      <StyledCol data-title="Клиент" className="referral-payout-table__client client">
        <div className="client__name">
          {requisition.client.lastname} {requisition.client.firstname}
        </div>
        <div className="client__email">
          {requisition.client.email}
        </div>
      </StyledCol>
      <StyledCol
        data-title="Сума"
        className="referral-payout-table__amount"
      >
        {requisition.amount} USDT
      </StyledCol>
      <StyledCol
        data-title="Дата"
        className="referral-payout-table__date"
      >
        {TimestampToDate(requisition.createdAt)}
      </StyledCol>
      <StyledCol
        data-title="Комментарий"
        className="referral-payout-table__message"
      >
        {requisition.commentary}
      </StyledCol>
      <StyledCol
        data-title="Статус"
        className="referral-payout-table__status"
      >
        <StyledRequisitionStatus>
          {requisitionStatus(requisition.status)}
        </StyledRequisitionStatus>
      </StyledCol>
      <StyledCol
        data-title="Кошелек"
        className="referral-payout-table__wallet"
      >
        {requisition.wallet}
      </StyledCol>
      <StyledCol
        data-title="Платежная система"
        className="referral-payout-table__usdt"
      >
        {requisition.usdtType}
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
