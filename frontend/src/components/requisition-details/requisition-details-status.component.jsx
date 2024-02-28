import React from "react";

import { StyledRequisitionDetailsStatus } from "./styled-requisition-details-status";
import {
  StyledStatusIcon,
  StyledStatusItem,
  StyledStatusTitle,
} from "./styled-requisition-details-status";

import { requisitionStatusConst } from "../../utils/requsition.status";

const RequisitionDetailsStatus = ({ status }) => {
  switch (status) {
    case requisitionStatusConst.PROCESSED: {
      return (
        <StyledRequisitionDetailsStatus>
          <RequisitionStatusStep title="Новая заявка" type="done" />
          <RequisitionStatusStep title="Оплачено" type="done" />
          <RequisitionStatusStep title="Ожидайте выплату" type="inProgress" />
          <RequisitionStatusStep title="Готово" type="waiting" />
        </StyledRequisitionDetailsStatus>
      );
    }
    case requisitionStatusConst.CARD_VERIFICATION: {
      return (
        <StyledRequisitionDetailsStatus>
          <RequisitionStatusStep title="Новая заявка" type="done" />
          <RequisitionStatusStep title="Оплачено" type="done" />
          <RequisitionStatusStep title="Ожидайте выплату" type="inProgress" />
          <RequisitionStatusStep title="Готово" type="waiting" />
        </StyledRequisitionDetailsStatus>
      );
    }
    case requisitionStatusConst.FINISHED: {
      return (
        <StyledRequisitionDetailsStatus>
          <RequisitionStatusStep title="Новая заявка" type="done" />
          <RequisitionStatusStep title="Оплачено" type="done" />
          <RequisitionStatusStep title="Выплачено" type="done" />
          <RequisitionStatusStep title="Готово" type="done" />
        </StyledRequisitionDetailsStatus>
      );
    }
    case requisitionStatusConst.CANCELED: {
      return (
        <StyledRequisitionDetailsStatus>
          <RequisitionStatusStep title="Новая заявка" type="canceled" />
          <RequisitionStatusStep title="Отменена" type="canceled" />
          <RequisitionStatusStep title="Отменена" type="canceled" />
          <RequisitionStatusStep title="Закрыта" type="canceled" />
        </StyledRequisitionDetailsStatus>
      );
    }
    case requisitionStatusConst.DISABLED: {
      return (
        <StyledRequisitionDetailsStatus>
          <RequisitionStatusStep title="Новая заявка" type="canceled" />
          <RequisitionStatusStep title="Не оплачена" type="canceled" />
          <RequisitionStatusStep title="Отменена" type="canceled" />
          <RequisitionStatusStep
            title="Время для оплаты заявки истекло"
            type="disabled"
          />
        </StyledRequisitionDetailsStatus>
      );
    }
    case requisitionStatusConst.ERROR: {
      return (
        <StyledRequisitionDetailsStatus>
          <RequisitionStatusStep title="Новая заявка" type="done" />
          <RequisitionStatusStep title="Ошибка транзакции" type="error" />
          <RequisitionStatusStep title="-" type="waiting" />
          <RequisitionStatusStep title="-" type="waiting" />
        </StyledRequisitionDetailsStatus>
      );
    }
    default: {
      return (
        <StyledRequisitionDetailsStatus>
          <RequisitionStatusStep title="Новая заявка" type="done" />
          <RequisitionStatusStep title="Не оплачена" type="inProgress" />
          <RequisitionStatusStep title="Ожидайте выплату" type="waiting" />
          <RequisitionStatusStep title="Готово" type="waiting" />
        </StyledRequisitionDetailsStatus>
      );
    }
  }
};

const RequisitionStatusStep = ({ title, type }) => {
  return (
    <StyledStatusItem type={type} className="step">
      <StyledStatusIcon className="step__icon" />
      <StyledStatusTitle className="step__title">{title}</StyledStatusTitle>
    </StyledStatusItem>
  );
};

export default RequisitionDetailsStatus;
