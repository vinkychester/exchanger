import React from "react";
import { NavLink } from "react-router-dom";
import { getUUID } from "../../../utils/calculator.utils";
import ReferralReportItemDetails from "./referral-report-item-details.component";
import Menu, { Item as MenuItem } from "rc-menu";
import Dropdown from "rc-dropdown";

import {
  StyledCardBody,
  StyledCardHeader,
  StyledDropdownButton,
  StyledMenuLink,
  StyledUserCard
} from "../../styles/styled-user-card";
import { StyledBlockText, StyledBlockTitle, StyledInfoBlock } from "../../styles/styled-info-block";
import {parseUuidIRI} from "../../../utils/response";

const ReferralReportItem = ({ client }) => {

  const menu = () => {
    return (
      <Menu className="card-submenu">
        <MenuItem key="1">
          <StyledMenuLink as={NavLink} to={`/panel/reports/details/${parseUuidIRI(client.id)}`}>
            Подробнее
          </StyledMenuLink>
        </MenuItem>
      </Menu>
    );
  };

  return (
    <StyledUserCard key={client.id}
    >
      <StyledCardHeader>
        <h4>
          <NavLink to={`/panel/reports/details/${parseUuidIRI(client.id)}`}>
            {client.firstname} {client.lastname}
          </NavLink>
        </h4>
        <Dropdown overlay={menu} trigger={["click"]} placement="bottomRight">
          <StyledDropdownButton>
            <span className="icon-sub-menu" />
          </StyledDropdownButton>
        </Dropdown>
      </StyledCardHeader>
      <StyledCardBody>
        <StyledInfoBlock>
          <StyledBlockTitle>
            E-mail:
          </StyledBlockTitle>
          <StyledBlockText>
            {client.email} {!client.isEnabled &&
          <span
            title="E-mail не подтвержден"
            className="icon-danger-triangle is-verified"
          />}
          </StyledBlockText>
        </StyledInfoBlock>
        <ReferralReportItemDetails client={client} />
      </StyledCardBody>
    </StyledUserCard>
  );
};

export default ReferralReportItem;
