import React, { createContext, useCallback, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useApolloClient } from "@apollo/react-hooks";
import queryString from "query-string";

import Can from "../../can/can.component";
import Title from "../../title/title.component";
import ManagersReportsDetailsFilter from "./managers-reports-details-filter.component";
import ManagersReportsDetailsList from "./managers-reports-details-list.component";
import ManagerName from "./manager-reports-name.component";

import { StyledReportsWrapper } from "../styled-reports";
import { StyledContainer } from "../../styles/styled-container";

import { GET_USER_RBAC_DETAILS } from "../../../graphql/queries/user.query";
import { reports } from "../../../rbac-consts";
import { endCurrentDate, startCurrentDate } from "../../../utils/datetime.util";

export const ManagersReportsDetailsFilterContext = createContext();

const ManagersReportsDetailsContainer = ({ match }) => {
  const format = "DD-MM-YYYY";
  const client = useApolloClient();

  const { userRole } = client.readQuery({
    query: GET_USER_RBAC_DETAILS,
  });

  let history = useHistory();
  let searchParams = queryString.parse(history.location.search);
  let params = Object.fromEntries(
    Object.entries(searchParams).filter(([_, v]) => v != null && v !== "")
  );

  const [filter, setFilter] = useState({
    ...params,
    date_gte: params.date_gte ?? startCurrentDate(format),
    date_lte: params.date_lte ?? endCurrentDate(format),
  });

  const manager_id = "/api/managers/" + match.params.id;

  const handleClearFilter = useCallback(() => {
    setFilter({});
  }, [filter]);

  const handleChangeFilter = useCallback(
    (name, value) => {
      setFilter((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    },
    [filter]
  );

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
      perform={reports.MANAGERS}
      yes={() => (
        <ManagersReportsDetailsFilterContext.Provider
          value={{ filter, handleChangeFilter, handleClearFilter, manager_id }}
        >
          <StyledContainer size="xl">
            <StyledReportsWrapper>
              <Title as="h1" title="Отчеты" className="reports-title" />
              <ManagerName />
              <ManagersReportsDetailsFilter />
              <ManagersReportsDetailsList />
            </StyledReportsWrapper>
          </StyledContainer>
        </ManagersReportsDetailsFilterContext.Provider>
      )}
    />
  );
};

export default ManagersReportsDetailsContainer;
