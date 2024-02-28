import React from "react";
import { LazyLoadImage } from 'react-lazy-load-image-component';

import AvatarSkeleton from "../account/skeleton/avatar-skeleton.component";
import ClientDetailsInviter from "./client-details-inviter.component";
import ClientDetailsRequisitionBtn from "./client-details-requisition-btn.component";

import { StyledBlockText, StyledBlockTitle, StyledInfoBlock } from "../styles/styled-info-block";
import {
  StyledClientCard,
  StyledClientCardBody,
  StyledClientCardHead,
  StyledClientName,
  StyledClientPhoto
} from "./styled-client-details";

import { TimestampToDate } from "../../utils/timestampToDate.utils";

const ClientDetails = ({ client, userRole }) => {
  const {
    id,
    firstname,
    lastname,
    email,
    createdAt,
    registrationType,
    mediaObject,
    trafficLink,
  } = client;
  return (
    <StyledClientCard>
      <StyledClientCardHead>
        {mediaObject ? (
          <StyledClientPhoto>
            <LazyLoadImage
              src={mediaObject.base64} alt="profile image" />
          </StyledClientPhoto>
        ) : (
          <AvatarSkeleton firstname={firstname} lastname={lastname} />
        )}
        <StyledInfoBlock>
          <StyledClientName>
            {firstname} {lastname}
          </StyledClientName>
          <StyledBlockTitle>E-mail:</StyledBlockTitle>
          <StyledBlockText>{email}</StyledBlockText>
        </StyledInfoBlock>
      </StyledClientCardHead>
      <StyledClientCardBody>
        <StyledInfoBlock>
          <StyledBlockTitle>Дата регистрации:</StyledBlockTitle>
          <StyledBlockText>{TimestampToDate(createdAt)}</StyledBlockText>
        </StyledInfoBlock>
        <StyledInfoBlock>
          <ClientDetailsInviter id={id} registrationType={registrationType} trafficLink={trafficLink} />
        </StyledInfoBlock>
        {userRole === 'manager' && (
          <StyledInfoBlock>
            <ClientDetailsRequisitionBtn id={id} />
          </StyledInfoBlock>
        )}
      </StyledClientCardBody>
    </StyledClientCard>
  );
};

export default ClientDetails;
