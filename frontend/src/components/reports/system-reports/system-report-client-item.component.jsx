import React from "react";
import { NavLink } from "react-router-dom";

import { StyledCardBody, StyledCardHeader, StyledUserCard } from "../../styles/styled-user-card";
import { StyledBlockText, StyledBlockTitle, StyledInfoBlock } from "../../styles/styled-info-block";

import { parseUuidIRI } from "../../../utils/response";
import { convertToUSD } from "../../../utils/convertToUSD.utils";
import { StyledList } from "../../styles/styled-document-elemets";

const SystemReportClientItem = ({
  id,
  firstname,
  lastname,
  email,
  isEnabled,
  all,
  created,
  pending,
  processed,
  finished,
  canceled,
  disabled,
  error
}) => {
  let profitRequisitions = 0;

  const { collection } = all;
  collection && collection.map(item => {
    const { profit, pair, requisitionFeeHistories } = item;
    const { payment } = pair;
    const { currency } = payment;
    const { tag } = currency;
    const { rate } = requisitionFeeHistories.find(fee => fee.type === "payment");
    profitRequisitions += convertToUSD(tag, profit, rate);
  });

  return (
    <StyledUserCard key={id}>
      <StyledCardHeader>
        <h4>
          <NavLink to={`/panel/clients/${parseUuidIRI(id)}`}>
            {firstname} {lastname}
          </NavLink>
        </h4>
      </StyledCardHeader>
      <StyledCardBody>
        <StyledInfoBlock>
          <StyledBlockTitle>E-mail:</StyledBlockTitle>
          <StyledBlockText>
            {email}{" "}
            {!isEnabled && (
              <span
                title="E-mail не подтвержден"
                className="icon-danger-triangle is-verified"
              />
            )}
          </StyledBlockText>
        </StyledInfoBlock>
        <StyledList>
          <li>Всего заявок: <span className="orange">{all.paginationInfo.totalCount}</span></li>
          <li>Всего новых заявок: <span className="orange">{created.paginationInfo.totalCount}</span></li>
          <li>Всего ожидающих заявок: <span className="orange">{pending.paginationInfo.totalCount}</span></li>
          <li>Всего оплаченных заявок: <span className="orange">{processed.paginationInfo.totalCount}</span></li>
          <li>Всего завершенных заявок: <span className="orange">{finished.paginationInfo.totalCount}</span></li>
          <li>Всего непроведенных заявок: <span className="orange">{canceled.paginationInfo.totalCount}</span></li>
          <li>Всего закрытых системой заявок: <span className="orange">{disabled.paginationInfo.totalCount}</span></li>
          <li>Всего ошибочных заявок: <span className="orange">{error.paginationInfo.totalCount}</span></li>
          <li>Общая прибыль по заявкам клиента: <span className="orange">{profitRequisitions.toFixed(2) + " USD"}</span>
          </li>
        </StyledList>
      </StyledCardBody>
    </StyledUserCard>
  );
};

export default SystemReportClientItem;
