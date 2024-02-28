import React from "react";
import { NavLink } from "react-router-dom";
import { getUUID } from "../../../utils/calculator.utils";
import Menu, { Item as MenuItem } from "rc-menu";
import Dropdown from "rc-dropdown";
import ReferralReportItemDetails from "./client-referral-report-item-details.component";

import {
  StyledCardBody,
  StyledCardHeader,
  StyledDropdownButton,
  StyledMenuLink,
  StyledUserCard
} from "../../styles/styled-user-card";
import { StyledBlockText, StyledBlockTitle, StyledInfoBlock } from "../../styles/styled-info-block";

const ClientReferralReportItem = ({ invitedUser }) => {
  const { id, firstname, lastname, email, isEnabled } = invitedUser;
  const menu = () => {
    return (
      <Menu className="card-submenu">
        <MenuItem key="1">
          <StyledMenuLink as={NavLink} to={`/panel/clients/${getUUID(id)}`}>
            Подробнее
          </StyledMenuLink>
        </MenuItem>
      </Menu>
    );
  };

  return (
    <StyledUserCard key={id}>
      <StyledCardHeader>
        <h4>
          <NavLink to={`/panel/clients/${getUUID(id)}`}>
            {firstname} {lastname}
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
          <StyledBlockTitle>E-mail:</StyledBlockTitle>
          <StyledBlockText>
            {email}
            {!isEnabled && (
              <span
                title="E-mail не подтвержден"
                className="icon-danger-triangle is-verified"
              />
            )}
          </StyledBlockText>
        </StyledInfoBlock>
        <ReferralReportItemDetails invitedUser={invitedUser} />
      </StyledCardBody>
    </StyledUserCard>
  );
};

export default ClientReferralReportItem;
