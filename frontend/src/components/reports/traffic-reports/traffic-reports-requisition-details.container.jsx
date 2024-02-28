import React, { createContext, useState, useCallback, useEffect } from "react";
import { useApolloClient } from "@apollo/react-hooks";
import { NavLink, useHistory } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import queryString from "query-string";

import Can from "../../can/can.component";
import Title from "../../title/title.component";
import BreadcrumbItem from "../../breadcrumb/breadcrumb-item";
import ForbiddenPage from "../../../pages/forbidden/forbidden.component";
import TrafficReportsRequisitionDetailsList from "./traffic-reports-requisition-details-list.component";
import TrafficReportsRequisitionDetailsFilter from "./traffic-reports-requisition-details-filter.component";

import { StyledContainer } from "../../styles/styled-container";
import { StyledBreadcrumb } from "../../styles/styled-breadcrumb";
import { StyledRequisitionWrapper } from "../../requisition-list/styled-requisition";
import { StyledTrafficDetailsWrapper } from "../styled-reports";

import { GET_USER_RBAC_DETAILS } from "../../../graphql/queries/user.query";
import { traffic } from "../../../rbac-consts";

export const TrafficReportsRequisitionDetailsContext = createContext();

const TrafficReportsRequisitionDetailsContainer = ({ match }) => {
  const client = useApolloClient();

  const { userRole } = client.readQuery({
    query: GET_USER_RBAC_DETAILS,
  });

  let history = useHistory();
  let searchParams = queryString.parse(history.location.search);

  const [totalCount, setTotalCount] = useState(0);
  const [filter, setFilter] = useState(
    Object.fromEntries(
      Object.entries(searchParams).filter(([_, v]) => v != null && v !== "")
    )
  );

  const handleChangeFilter = useCallback(
    (name, value) => {
      let object =
        name !== "page" ? { [name]: value, page: 1 } : { [name]: value };
      setFilter((prevState) => ({
        ...prevState,
        ...object,
      }));
    },
    [filter]
  );

  const handleClearFilter = useCallback(() => {
    setFilter({});
  }, [filter]);

  useEffect(() => {
    let filtered = Object.fromEntries(
      Object.entries(filter).filter(([_, v]) => v != null && v !== "")
    );
    history.replace({
      search: queryString.stringify({ ...filtered }),
    });
  }, [filter]);

  return (
    <Can
      role={userRole}
      perform={traffic.REQUISITION_DETAILS}
      yes={() => (
        <TrafficReportsRequisitionDetailsContext.Provider
          value={{
            filter,
            handleChangeFilter,
            handleClearFilter,
            totalCount,
            setTotalCount,
          }}
        >
          <StyledContainer size="xl">
            <Helmet>
              <title>Список заявок по трафику - Coin24</title>
            </Helmet>
            <StyledTrafficDetailsWrapper>
              <StyledRequisitionWrapper
                role={userRole}
                className="traffic-details__requisitions"
              >
                <Title
                  as="h1"
                  title="Заявки"
                  className="traffic-details__title"
                />
                <StyledBreadcrumb className="traffic-details__breadcrumb">
                  <BreadcrumbItem as={NavLink} to="/" title="Главная" />
                  <BreadcrumbItem
                    as={NavLink}
                    to="/panel/reports"
                    title="Отчеты"
                  />
                  <BreadcrumbItem as="span" title="Список клиентов" />
                </StyledBreadcrumb>
                <TrafficReportsRequisitionDetailsFilter />
                <TrafficReportsRequisitionDetailsList
                  id={parseInt(match.params.id)}
                />
              </StyledRequisitionWrapper>
            </StyledTrafficDetailsWrapper>
          </StyledContainer>
        </TrafficReportsRequisitionDetailsContext.Provider>
      )}
      no={() => <ForbiddenPage />}
    />
  );
};

export default TrafficReportsRequisitionDetailsContainer;
