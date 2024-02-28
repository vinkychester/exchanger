import React from "react";
import { NavLink } from "react-router-dom";
import Menu, { Item as MenuItem } from "rc-menu";
import Dropdown from "rc-dropdown";

import "rc-dropdown/assets/index.css";

import {
  StyledCardBody,
  StyledCardHeader,
  StyledDropdownButton,
  StyledUserCard,
  StyledMenuLink
} from "../../styles/styled-user-card";
import {
  StyledBlockText,
  StyledBlockTitle,
  StyledInfoBlock,
} from "../../styles/styled-info-block";

import { parseUuidIRI } from "../../../utils/response";
import { TimestampToDate } from "../../../utils/timestampToDate.utils";

const TrafficReportsClientDetailsItem = ({
  id,
  firstname,
  lastname,
  email,
  status,
  createdAt,
  isEnabled,
  registrationType,
}) => {

  const menu = () => {
    return (
      <Menu className="card-submenu">
        <MenuItem key="1">
          <StyledMenuLink
            as={NavLink}
            to={`/panel/clients/${parseUuidIRI(id)}`}
          >
            Подробнее
          </StyledMenuLink>
        </MenuItem>
      </Menu>
    );
  };

  return (
    <StyledUserCard className="clients-card" key={id}>
      <StyledCardHeader>
        <h4>
          <NavLink to={`/panel/clients/${parseUuidIRI(id)}`}>
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
        <StyledInfoBlock className="clients-card__row">
          <StyledBlockTitle>E-mail:</StyledBlockTitle>
          <StyledBlockText className="clients-card__text">
            {email}{" "}
            {!isEnabled && (
              <span
                title="E-mail не подтвержден"
                className="icon-danger-triangle is-verified"
              />
            )}
          </StyledBlockText>
        </StyledInfoBlock>
        <StyledInfoBlock className="clients-card__row">
          <StyledBlockTitle>Дата регистрации:</StyledBlockTitle>
          <StyledBlockText>{TimestampToDate(createdAt)}</StyledBlockText>
        </StyledInfoBlock>
        <StyledInfoBlock className="clients-card__row"></StyledInfoBlock>
        <StyledInfoBlock className="clients-card__row">
          <StyledBlockTitle>Статус:</StyledBlockTitle>
          <StyledBlockText>
            {status === "trusted"
              ? "доверенный"
              : status === "suspicious"
              ? "подозрительный"
              : "стабильный"}
          </StyledBlockText>
        </StyledInfoBlock>
        <StyledInfoBlock className="clients-card__row">
          <StyledBlockTitle>Тип регистрации:</StyledBlockTitle>
          <StyledBlockText>
            {registrationType === "referral"
              ? "Регистрация по реферальной ссылке"
              : registrationType === "traffic"
              ? "Регистрация по трафиковой ссылке"
              : "Прямой переход"}
          </StyledBlockText>
        </StyledInfoBlock>
      </StyledCardBody>
    </StyledUserCard>
  );
};

export default TrafficReportsClientDetailsItem;
