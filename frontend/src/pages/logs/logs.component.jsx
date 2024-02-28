import React, { createContext, useState, useEffect, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import { useApolloClient } from "@apollo/react-hooks";
import { useHistory } from "react-router-dom";
import queryString from "query-string";

import Can from "../../components/can/can.component";
import ForbiddenPage from "../forbidden/forbidden.component";
import Title from "../../components/title/title.component";
import LogsFilter from "../../components/logs/logs-filter.component";
import LogsList from "../../components/logs/logs-list.component";

import { StyledContainer } from "../../components/styles/styled-container";
import { StyledAdminLogsWrapper } from "../../components/logs/styled-admin-logs";

import { GET_USER_RBAC_DETAILS } from "../../graphql/queries/user.query";
import { logs } from "../../rbac-consts";

export const LogsFilterContext = createContext();

const LogsPage = () => {
  const client = useApolloClient();

  let history = useHistory();
  let searchParams = queryString.parse(history.location.search);

  const { userRole } = client.readQuery({
    query: GET_USER_RBAC_DETAILS,
  });

  const [filter, setFilter] = useState(
    Object.fromEntries(
      Object.entries(searchParams).filter(([_, v]) => v != null && v !== "")
    )
  );

  const handleChangeFilter = useCallback(
    (name, value) => {
      setFilter((prevState) => ({
        ...prevState,
        [name]: value,
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
      perform={logs.PANEL_READ}
      yes={() => (
        <StyledContainer size="xl">
          <Helmet>
            <title>Логи - Coin24</title>
          </Helmet>
          <StyledAdminLogsWrapper>
            <Title as="h1" title="Логи" className="admin-logs-title" />
            <LogsFilterContext.Provider
              value={{ filter, handleChangeFilter, handleClearFilter }}
            >
              <LogsFilter />
              <LogsList />
            </LogsFilterContext.Provider>
          </StyledAdminLogsWrapper>
        </StyledContainer>
      )}
      no={() => <ForbiddenPage />}
    />
  );
};

export default React.memo(LogsPage);
