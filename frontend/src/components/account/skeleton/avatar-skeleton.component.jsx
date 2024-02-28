import React from "react";
import FragmentSpinner from "../../spinner/fragment-spinner.component";

import { StyledSkeletonAvatar } from "./styled-skeleton-account";

const AvatarSkeleton = ({ firstname, lastname, loading }) => {

  return (
    <StyledSkeletonAvatar>
      {loading && <FragmentSpinner />}
      {firstname && firstname.charAt(0)}{lastname && lastname.charAt(0)}
    </StyledSkeletonAvatar>
  );
};

export default AvatarSkeleton;