import React, { useEffect, useState } from "react";
import { requisitionStatus } from "../../utils/requsition.status";
import { useQuery } from "@apollo/react-hooks";
import { TimestampToDate } from "../../utils/timestampToDate.utils";
import { GET_PAYOUT_REQUISITIONS } from "../../graphql/queries/payout-requisitions.query";

import { StyledRequisitionStatus } from "../requisition-list/styled-requisition";
import {
  StyledCol,
  StyledColHead,
  StyledRow,
  StyledTable,
  StyledTableBody,
  StyledTableHeader
} from "../styles/styled-table";
import AlertMessage from "../alert/alert.component";

const ReferralPayoutHistory = ({ userUUID, isUpdatePayoutHistory, setIsUpdatePayoutHistory }) => {
  const [payoutRequisitionsHistory, setPayoutRequisitionsHistory] = useState(null);

  const { data, loading, refetch } = useQuery(GET_PAYOUT_REQUISITIONS, {
    variables: {
      clientID: userUUID
    },
    onCompleted: data => {
      setPayoutRequisitionsHistory(data.payoutRequisitions.collection);
    }
  });

  useEffect(() => {
    if(isUpdatePayoutHistory === true) {
      refetch().then(data => {
        setPayoutRequisitionsHistory(data.data.payoutRequisitions.collection);
      }).then(() => {
        setIsUpdatePayoutHistory(false);
      })
    }
  }, [isUpdatePayoutHistory])

  if (payoutRequisitionsHistory === null || !payoutRequisitionsHistory.length) return <AlertMessage type="info" message="Нет истории выводов"/>

  return (
    <StyledTable className="referral-payout-table">
      <StyledTableHeader
        col="4"
        className="referral-payout-table__head"
      >
        <StyledColHead>Сума</StyledColHead>
        <StyledColHead>Дата</StyledColHead>
        <StyledColHead>Комментарий</StyledColHead>
        <StyledColHead>Статус</StyledColHead>
      </StyledTableHeader>
      <StyledTableBody>
        {payoutRequisitionsHistory && payoutRequisitionsHistory.map(({ amount, createdAt, commentary, status, id }) => (
          <StyledRow key={id} col="4" className="referral-payout-table__row">
            <StyledCol data-title="Сума" className="referral-payout-table__number">
              {amount} USDT
            </StyledCol>
            <StyledCol data-title="Дата" className="referral-payout-table__createdAt">
              {TimestampToDate(createdAt)}
            </StyledCol>
            <StyledCol inline data-title="Комментарий" className="referral-payout-table__message">
              <p>
                {commentary}
              </p>
            </StyledCol>
            <StyledCol data-title="Статус" className="referral-payout-table__status">
              <StyledRequisitionStatus status={status}>
                {requisitionStatus(status)}
              </StyledRequisitionStatus>
            </StyledCol>
          </StyledRow>
        ))}
      </StyledTableBody>
    </StyledTable>
  );
};

export default ReferralPayoutHistory;
