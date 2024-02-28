import React from "react";
import { useMutation, useApolloClient } from "@apollo/react-hooks";
import Countdown from "react-countdown";
import Tooltip from "rc-tooltip";

import { StyledTooltip } from "../styles/styled-tooltip";

import { GET_USER_RBAC_DETAILS } from "../../graphql/queries/user.query";
import { UPDATE_REQUISITION_STATUS } from "../../graphql/mutations/requisition.mutation";
import { GET_REQUISITION_DETAILS } from "../../graphql/queries/requisition.query";
import {
  finishStatus,
  requisitionStatusConst,
} from "../../utils/requsition.status";
import { TimestampToDateNEW } from "../../utils/timestampToDate.utils";
import { findInvoice } from "../../utils/requisition.util";

const RequisitionDetailsTimer = ({
  createdAt,
  isCash,
  status,
  requisitionId,
  invoices,
}) => {
  const client = useApolloClient();

  const { userRole } = client.readQuery({
    query: GET_USER_RBAC_DETAILS,
  });

  const [updateStatus] = useMutation(UPDATE_REQUISITION_STATUS);

  let paymentInvoice = {};
  
  if (invoices.length) {
    paymentInvoice = findInvoice(invoices, "payment");
  }

  const handleComplete = () => {
    updateStatus({
      variables: { id: requisitionId, status: requisitionStatusConst.DISABLED },
      refetchQueries: [
        {
          query: GET_REQUISITION_DETAILS,
          variables: {
            id: requisitionId,
            isManager: "client" !== userRole && "manager" !== userRole,
          },
        },
      ],
    });
  };
  const timer = isCash ? 1000 * 60 * 60 * 72 : 1000 * 60 * 60 * 24;
  console.log(paymentInvoice?.isPaid, finishStatus(status), userRole !== "client");

  const renderer = ({ formatted: { hours, minutes, seconds }, completed }) => {
    if (status === requisitionStatusConst.NEW && completed) {
      return (
        <p className="requisition-lifetime_expired">
          Время для оплаты заявки истекло
        </p>
      );
    }

    return (
      <p className="requisition-lifetime">
        <span className="icon-clock" />
        {hours}:{minutes}:{seconds}
        <Tooltip
          placement="top"
          overlay="Оставшееся время жизни заявки до автоматического закрытия."
        >
          <StyledTooltip className="icon-question" opacity="0.4" />
        </Tooltip>
      </p>
    );
  };

  return (
    <>
      {status === requisitionStatusConst.NEW && (
        <Countdown
          date={createdAt * 1000 + timer}
          renderer={renderer}
          daysInHours={true}
          onComplete={handleComplete}
        />
      )}
      {finishStatus(status) && !paymentInvoice?.isPaid && userRole !== "client" && (
        <p className="requisition-lifetime">
          <span className="icon-clock" />
          <span className="auto-close">
             {isCash
               ? TimestampToDateNEW(paymentInvoice?.createdAt ?? createdAt)
               : TimestampToDateNEW(createdAt)}
          </span>
          <Tooltip
            placement="top"
            overlay="Дата и время автоматического закрытия заявки в случае неоплаты"
          >
            <StyledTooltip className="icon-question" opacity="0.4" />
          </Tooltip>
        </p>
      )}
    </>
  );
};

export default RequisitionDetailsTimer;
