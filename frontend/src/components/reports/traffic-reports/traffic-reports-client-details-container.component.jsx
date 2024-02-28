import React, { createContext, useState, useCallback, useEffect } from "react";
import { useApolloClient } from "@apollo/react-hooks";
import { NavLink, useHistory } from "react-router-dom";
import queryString from "query-string";

import { Helmet } from "react-helmet-async";
import Title from "../../title/title.component";
import Can from "../../can/can.component";
import ForbiddenPage from "../../../pages/forbidden/forbidden.component";
import TrafficReportsClientDetailsList from "./traffic-reports-client-details-list.component";
import TrafficReportsClientDetailsFilter from "./traffic-reports-client-details-filter.component";

import { GET_USER_RBAC_DETAILS } from "../../../graphql/queries/user.query";
import { traffic } from "../../../rbac-consts";

import { StyledContainer } from "../../styles/styled-container";
import BreadcrumbItem from "../../breadcrumb/breadcrumb-item";
import { StyledBreadcrumb } from "../../styles/styled-breadcrumb";
import { StyledTrafficDetailsWrapper } from "../styled-reports";

export const TrafficReportsClientDetailsContext = createContext();

const TrafficReportsClientDetailsContainer = ({ match }) => {
  const client = useApolloClient();

  let history = useHistory();
  let searchParams = queryString.parse(history.location.search);

  const { userRole } = client.readQuery({
    query: GET_USER_RBAC_DETAILS,
  });

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
      perform={traffic.CLIENT_DETAILS}
      yes={() => (
        <TrafficReportsClientDetailsContext.Provider
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
              <title>Список клиентов по трафику - Coin24</title>
            </Helmet>
            <StyledTrafficDetailsWrapper>
              <Title
                as="h1"
                title="Клиенты по трафику"
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
              <TrafficReportsClientDetailsFilter />
              <TrafficReportsClientDetailsList id={parseInt(match.params.id)} />
            </StyledTrafficDetailsWrapper>
          </StyledContainer>
        </TrafficReportsClientDetailsContext.Provider>
      )}
      no={() => <ForbiddenPage />}
    />
  );
};

export default TrafficReportsClientDetailsContainer;
