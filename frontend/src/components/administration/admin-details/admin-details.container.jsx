import React from "react";
import Avatar from "../../avatar/avatar.component";
import { TimestampToDate } from "../../../utils/timestampToDate.utils";

import { StyledBlockText, StyledBlockTitle, StyledInfoBlock } from "../../styles/styled-info-block";
import {
  StyledAdministrationCard,
  StyledAdministrationCardBody,
  StyledAdministrationCardHead,
  StyledAdministrationName
} from "../styled-administration-details";

const AdminDetailsContainer = ({ user }) => {
  return (
    <>
      <StyledAdministrationCard>
        <StyledAdministrationCardHead>
          <Avatar user={user} />
          <StyledInfoBlock>
            <StyledAdministrationName>
              <h4>
                {user.firstname} {user.lastname}
              </h4>
            </StyledAdministrationName>
            <StyledBlockTitle>E-mail:</StyledBlockTitle>
            <StyledBlockText>{user.email}</StyledBlockText>
          </StyledInfoBlock>
        </StyledAdministrationCardHead>
        <StyledAdministrationCardBody>
          <StyledInfoBlock>
            <StyledBlockTitle>Дата регистрации:</StyledBlockTitle>
            <StyledBlockText>{TimestampToDate(user.createdAt)}</StyledBlockText>
          </StyledInfoBlock>
        </StyledAdministrationCardBody>
      </StyledAdministrationCard>
    </>
  );
};
export default AdminDetailsContainer;
