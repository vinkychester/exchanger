import React from "react";
import { useQuery, useApolloClient } from "@apollo/react-hooks";
import { NavLink } from "react-router-dom";
import Tooltip from "rc-tooltip";

import Can from "../../components/can/can.component";
import CardVerificationDeleteButton from "./card-verification-delete-button.component";

import { StyledCol, StyledRow } from "../styles/styled-table";
import { StyledCardStatus } from "./styled-verification-card";
import { StyledButton } from "../styles/styled-button";
import { StyledTooltip } from "../styles/styled-tooltip";

import { GET_USER_RBAC_DETAILS } from "../../graphql/queries/user.query";
import { TimestampToDate } from "../../utils/timestampToDate.utils";
import { cardVerification } from "../../rbac-consts";
import { parseUuidIRI } from "../../utils/response";
import { creditCardStatuses } from "../../utils/consts.util";

import translate from "../../i18n/translate";

const CardVerificationItem = ({
  id,
  cardMask,
  expiryDate,
  status,
  createdAt,
  client,
}) => {
  const clientApollo = useApolloClient();

  const { userRole } = clientApollo.readQuery({
    query: GET_USER_RBAC_DETAILS,
  });

  const { id: clientId, firstname, lastname, email } = client;

  return (
    <StyledRow className="verification-card-table__row">
      <StyledCol
        className="verification-card-table__createdAt"
        data-title="Дата"
      >
        {TimestampToDate(createdAt)}
      </StyledCol>
      <Can
        role={userRole}
        perform={cardVerification.CLIENT_DETAILS}
        yes={() => (
          <StyledCol
            className="verification-card-table__client"
            data-title="Клиент"
          >
            <div className="client__name">
              <NavLink to={`/panel/clients/${parseUuidIRI(clientId)}`}>
                {firstname} {lastname}
              </NavLink>
            </div>
            <div className="client__email">{email}</div>
          </StyledCol>
        )}
      />
      <StyledCol
        className="verification-card-table__number"
        data-title="Номер карты"
      >
        {cardMask}
      </StyledCol>
      <StyledCol
        className="verification-card-table__expirydate"
        data-title="Срок действия карты"
      >
        {expiryDate}
      </StyledCol>
      <StyledCol
        className="verification-card-table__status"
        data-title="Статус"
      >
        <StyledCardStatus status={status}>
          {translate(status)}
          {status === "NOT_VERIFIED" && (
            <Tooltip
              placement="top"
              overlay="На процесс верификации отводится до 24 часов. Однако по факту, проверка занимает меньше 1 часа."
            >
              <StyledTooltip className="icon-question" opacity="0.4" />
            </Tooltip>
          )}
        </StyledCardStatus>
      </StyledCol>
      <StyledCol
        data-title="Действие"
        className="verification-card-table__action"
      >
        <StyledButton
          to={`/panel/card-verification/details/${parseUuidIRI(id)}`}
          as={NavLink}
          color="info"
          weight="normal"
        >
          Детали
        </StyledButton>
        {status === creditCardStatuses.CANCELED && (
          <Can
            role={userRole}
            perform={cardVerification.DELETE}
            yes={() => (
              <CardVerificationDeleteButton id={id} cardMask={cardMask} />
            )}
          />
        )}
      </StyledCol>
    </StyledRow>
  );
};

export default CardVerificationItem;
