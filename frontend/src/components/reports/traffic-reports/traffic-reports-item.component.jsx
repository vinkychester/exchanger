import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Tooltip from "rc-tooltip";

import { getID } from "../../../utils/calculator.utils";
import { StyledCol } from "../../styles/styled-table";
import { StyledButton } from "../../styles/styled-button";
import { StyledTooltip } from "../../styles/styled-tooltip";

import { closableNotificationWithClick } from "../../notification/closable-notification-with-click.component";
import TrafficReportsRegisteredClients from "./traffic-reports-registered-clients.component";

const TrafficReportsItem = ({ trafficLink, onDeleteClick }) => {
  const { siteUrl, token, siteName, trafficDetails, id } = trafficLink;
  const [clientsTotalCount, setClientsTotalCount] = useState(0);
  return (
    <>
      <StyledCol data-title="Сайт" className="traffic-list-table__website">
        {siteName}
      </StyledCol>
      <StyledCol
        data-title="Кол-во переходов"
        className="traffic-list-table__count-clicks"
      >
        {trafficDetails.paginationInfo.totalCount}
      </StyledCol>
      <TrafficReportsRegisteredClients
        trafficLink={trafficLink}
        clientsTotalCount={clientsTotalCount}
        setClientsTotalCount={setClientsTotalCount}
      />
      <StyledCol data-title="Ссылка" className="traffic-list-table__link">
        <CopyToClipboard
          text={
            siteUrl
              ? siteUrl + "?traffic=" + token
              : "https://coin24.com.ua/traffic/" + token
          }
          onCopy={() => {
            closableNotificationWithClick("Скопированно", "success");
          }}
        >
          <div className="traffic-link" title="Скопировать">
            <StyledButton>
              <span className="icon-copy" />
            </StyledButton>
            <div className="traffic-link__url">
              {siteUrl
                ? siteUrl + "?traffic=" + token
                : "https://coin24.com.ua/traffic/" + token}
            </div>
          </div>
        </CopyToClipboard>
      </StyledCol>
      <StyledCol data-title="Действие" className="traffic-list-table__action">
        <StyledButton
          color="info"
          weight="normal"
          as={NavLink}
          to={`/panel/reports/traffic-details/${getID(id)}`}
        >
          Детали
        </StyledButton>
        {clientsTotalCount === 0 ? (
          <StyledButton
            color="danger"
            weight="normal"
            onClick={() => onDeleteClick(trafficLink)}
          >
            Удалить
          </StyledButton>
        ) : (
          <Tooltip
            placement="top"
            overlay="Невозможно удалить трафиковую ссылку так как она связана с пользователем"
          >
            <StyledTooltip size="18" opacity="0.5" className="icon-question" />
          </Tooltip>
        )}
      </StyledCol>
    </>
  );
};

export default TrafficReportsItem;
