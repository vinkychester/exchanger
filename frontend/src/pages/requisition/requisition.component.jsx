import React, { useEffect, useState, useCallback, createContext } from "react";
import { Helmet } from "react-helmet-async";
import { useApolloClient } from "@apollo/react-hooks";
import { useHistory } from "react-router-dom";
import queryString from "query-string";

import Can from "../../components/can/can.component";
import Title from "../../components/title/title.component";
import ForbiddenPage from "../forbidden/forbidden.component";
import RequisitionFilter from "../../components/requisition-list/requisition-filter.component";

import RequisitionList from "../../components/requisition-list/requisition-list.component";

import { StyledRequisitionWrapper } from "../../components/requisition-list/styled-requisition";
import { StyledContainer } from "../../components/styles/styled-container";

import { GET_USER_RBAC_DETAILS } from "../../graphql/queries/user.query";
import { requisition } from "../../rbac-consts";
import { requisitionStatusArray } from "../../utils/requsition.status";

export const RequisitionFilterContext = createContext();

const RequisitionPage = () => {
  let history = useHistory();
  let statusRequisition = {};
  let searchParams = queryString.parse(history.location.search);

  const client = useApolloClient();

  const { userRole } = client.readQuery({
    query: GET_USER_RBAC_DETAILS,
  });
  
  let params = Object.fromEntries(Object.entries(searchParams).filter(([_, v]) => v != null && v !== ""));
  switch (userRole) {
    case "client":
      statusRequisition = { status: null };
      break;
    default:
      statusRequisition = { status: params.status ?? requisitionStatusArray.NOT_PROCESSING };
  }
  const [totalCount, setTotalCount] = useState(0);
  const [filter, setFilter] = useState({
    ...params,
    ...statusRequisition
  });


  const handleChangeFilter = useCallback(
    (name, value) => {
      let object = name !== "page" ? { [name]: value, page: 1 } : { [name]: value };
      setFilter((prevState) => ({
        ...prevState,
        ...object
      }));
    },
    [filter]
  );

  const handleClearFilter = useCallback(() => {
    setFilter({});
  }, [filter]);

  useEffect(() => {
    let filtered = Object.fromEntries(Object.entries(filter).filter(([_, v]) => v != null && v !== ""));
    history.replace({
      search: queryString.stringify({ ...filtered })
    });
  }, [filter]);

  return (
    <Can
      role={userRole}
      perform={requisition.READ}
      yes={() => (
        <StyledContainer size={userRole !== "client" ? "xl" : null}>
          <Helmet>
            <title>Заявки - Coin24</title>
          </Helmet>
          <StyledRequisitionWrapper role={userRole}>
            <Title as="h1" title="Операции обмена" description="Заявки" />
            <RequisitionFilterContext.Provider
              value={{ filter, handleChangeFilter, handleClearFilter, totalCount, setTotalCount }}
            >
              <RequisitionFilter />
              <RequisitionList />
            </RequisitionFilterContext.Provider>
          </StyledRequisitionWrapper>
        </StyledContainer>
      )}
      no={() => <ForbiddenPage />}
    />
  );
};

export default React.memo(RequisitionPage);
