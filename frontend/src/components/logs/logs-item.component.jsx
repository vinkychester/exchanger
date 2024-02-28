import React from "react";

import { StyledCol, StyledRow } from "../styles/styled-table";
import { StyledLogsLevel, StyledLogsRole } from "./styled-admin-logs";

import { DateToFormat } from "../../utils/timestampToDate.utils";

const LogsItem = ({ id, entityClass, userEmail, action, text, ip, date }) => {
  const role =
    entityClass === "_systemEvent"
      ? "SystemEvent"
      : entityClass.split("App\\Entity\\")[1];

  return (
    <StyledRow col="6" key={id} className="admin-logs-table__row">
      <StyledCol data-title="Роль" className="admin-logs-table__role">
        <StyledLogsRole role={role}>{role}</StyledLogsRole>
      </StyledCol>
      <StyledCol data-title="E-mail" className="admin-logs-table__email">
        {userEmail}
      </StyledCol>
      <StyledCol data-title="Уровень" className="admin-logs-table__level">
        <StyledLogsLevel level={action}>{action}</StyledLogsLevel>
      </StyledCol>
      <StyledCol data-title="Событие" className="admin-logs-table__message">
        <p>{text}</p>
      </StyledCol>
      <StyledCol data-title="IP" className="admin-logs-table__ip">
        {ip}
      </StyledCol>
      <StyledCol data-title="Дата" className="admin-logs-table__date">
        {DateToFormat(date)}
      </StyledCol>
    </StyledRow>
  );
};

export default LogsItem;
