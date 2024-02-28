import React, { createContext, useCallback, useEffect, useState } from "react";
import { useApolloClient } from "@apollo/react-hooks";
import { useHistory } from "react-router-dom";
import queryString from "query-string";

import Can from "../../can/can.component";
import TrafficFilter from "./traffic-filter.component";
import TrafficReportsList from "./traffic-reports-list.component";

import { StyledTrafficWrapper } from "../styled-reports";

import { GET_USER_RBAC_DETAILS } from "../../../graphql/queries/user.query";
import { traffic } from "../../../rbac-consts";
import { endCurrentDate, startCurrentDate } from "../../../utils/datetime.util";
import TrafficReportsForm from "./traffic-reports-form.component";

export const TrafficFilterContext = createContext();

const TrafficReportsContainer = () => {
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
    tdate_gte: params.tdate_gte ?? startCurrentDate(format),
    tdate_lte: params.tdate_lte ?? endCurrentDate(format),
  });

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
    <StyledTrafficWrapper>
      <TrafficFilterContext.Provider
        value={{ filter, handleChangeFilter, handleClearFilter }}
      >
        <Can
          role={userRole}
          perform={traffic.CREATE}
          yes={() => <TrafficReportsForm />}
        />
        <TrafficFilter />
        <TrafficReportsList />
      </TrafficFilterContext.Provider>
    </StyledTrafficWrapper>
  );
};

export default TrafficReportsContainer;
