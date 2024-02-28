import React from "react";
import { LazyLoadImage } from 'react-lazy-load-image-component';

import AvatarSkeleton from "../account/skeleton/avatar-skeleton.component";

import { StyledClientPhoto } from "../client-details/styled-client-details";

const Avatar = ({ user }) => {
  const { firstname, lastname, mediaObject } = user;

  return mediaObject ? (
    <StyledClientPhoto>
      <LazyLoadImage
        src={mediaObject.base64} alt="profile image" />
    </StyledClientPhoto>
  ) : (
    <AvatarSkeleton firstname={firstname} lastname={lastname} />
  );
};

export default Avatar;
