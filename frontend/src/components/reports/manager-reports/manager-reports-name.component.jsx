import React, { useContext } from "react";
import { useQuery } from "@apollo/react-hooks";
import { NavLink } from "react-router-dom";

import Spinner from "../../spinner/spinner.component";
import AlertMessage from "../../alert/alert.component";
import BreadcrumbItem from "../../breadcrumb/breadcrumb-item";

import { StyledBreadcrumb } from "../../styles/styled-breadcrumb";

import { ManagersReportsDetailsFilterContext } from "./managers-reports-details.container";
import { GET_MANAGER_NAME } from "../../../graphql/queries/manager.query";
import { StyledSkeletonBg } from "../../styles/styled-skeleton-bg";

const ManagerReportsName = () => {
  const { manager_id } = useContext(ManagersReportsDetailsFilterContext);

  const { data, loading, error } = useQuery(GET_MANAGER_NAME, {
    variables: { manager_id },
    fetchPolicy: "network-only"
  });

  if (loading) return <StyledBreadcrumb className="reports-breadcrumb"><StyledSkeletonBg color="theme" height="19" width="7" /></StyledBreadcrumb>;
  if (error) return <AlertMessage type="error" message={error.message} />;
  if (!data) return null;

  const { firstname, lastname } = data.manager;

  return (
    <StyledBreadcrumb className="reports-breadcrumb">
      <BreadcrumbItem as={NavLink} to="/" title="Главная" />
      <BreadcrumbItem as={NavLink} to="/panel/reports?currentTab=manager" title="Отчеты" />
      <BreadcrumbItem as="span" title={`${firstname} ${lastname}`} />
    </StyledBreadcrumb>
  );
};

export default ManagerReportsName;
