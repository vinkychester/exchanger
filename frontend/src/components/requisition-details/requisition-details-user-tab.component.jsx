import React from "react";
import { NavLink } from "react-router-dom";

import {
  StyledBlockSubText,
  StyledBlockText,
  StyledBlockTitle,
  StyledInfoBlock,
} from "../styles/styled-info-block";

import { parseUuidIRI } from "../../utils/response";

const RequisitionDetailsUserTab = ({ label, user }) => {
  const { id, firstname, lastname, email, __typename } = user;

  return (
    <StyledInfoBlock className="requisition-info__item">
      <StyledBlockTitle>{label}:</StyledBlockTitle>
      <StyledBlockText className="requisition-info__title">
        <NavLink to={`/panel/${__typename === "Client" ? "clients" : "managers"}/${parseUuidIRI(id)}`}>
          {firstname} {lastname}
        </NavLink>
      </StyledBlockText>
      <StyledBlockSubText>
        <p>{email}</p>
      </StyledBlockSubText>
    </StyledInfoBlock>
  );
};

export default RequisitionDetailsUserTab;
