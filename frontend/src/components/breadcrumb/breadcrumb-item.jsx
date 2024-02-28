import React from "react";

import {
  StyledBreadcrumbItem,
  StyledBreadcrumbLink,
} from "../styles/styled-breadcrumb";

const BreadcrumbItem = ({ as, to, title }) => {
  return (
    <StyledBreadcrumbItem>
      <StyledBreadcrumbLink as={as} to={to} title={title}>
        {title}
      </StyledBreadcrumbLink>
    </StyledBreadcrumbItem>
  );
};

export default BreadcrumbItem;
