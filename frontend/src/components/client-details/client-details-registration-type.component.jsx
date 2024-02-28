import React from "react";
import { NavLink } from "react-router-dom";

import { StyledBlockText } from "../styles/styled-info-block";

import { parseUuidIRI } from "../../utils/response";

const ClientDetailsRegistrationType = ({ type, referralId, trafficLink }) => {
  return (
    <>
      {type === "default" && <StyledBlockText>Прямой переход</StyledBlockText>}
      {type === "referral" && referralId && (
        <StyledBlockText>
          <NavLink
            className="default-link"
            to={`/panel/reports/referrals/${parseUuidIRI(referralId)}/1`}
          >
            Регистрация по реферальной ссылке
          </NavLink>
        </StyledBlockText>
      )}
      {type === "traffic" && trafficLink && (
        <StyledBlockText>
          <span>
            Регистрация по трафиковой ссылке {" "}
            <NavLink
              className="default-link"
              to={`/panel/reports/traffic-details-clients/${parseUuidIRI(
                trafficLink.id
              )}`}
            >
            {trafficLink.siteName}
          </NavLink>
          </span>
        </StyledBlockText>
      )}
    </>
  );
};

export default ClientDetailsRegistrationType;
