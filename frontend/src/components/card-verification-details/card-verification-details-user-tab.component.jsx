import React from "react";
import { NavLink } from "react-router-dom";
import { parseUuidIRI } from "../../utils/response";

import { StyledCol } from "../styles/styled-table";

const CardVerificationDetailsUserTab = ({ user }) => {
  const { firstname, lastname, email, id } = user;
  return (
    <StyledCol data-title="Клиент" className="client">
      <div className="client__name">
        <NavLink to={`/panel/clients/${parseUuidIRI(id)}`}>
          {firstname} {lastname}
        </NavLink>
      </div>
      <div className="client__email">
        {email}
      </div>
    </StyledCol>
  );
};

export default CardVerificationDetailsUserTab;
