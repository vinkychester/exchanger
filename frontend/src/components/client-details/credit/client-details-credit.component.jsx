import React, { createContext, useCallback, useEffect, useState } from "react";
import { useApolloClient } from "@apollo/react-hooks";
import { useHistory } from "react-router-dom";
import queryString from "query-string";

import ClientDetailsCreditList from "./client-details-credit-list.component";
import AlertMessage from "../../alert/alert.component";
import Can from "../../can/can.component";
import ClientDetailsCreditFilter from "./client-details-credit-filter.component";

import { GET_USER_RBAC_DETAILS } from "../../../graphql/queries/user.query";
import { cardVerification } from "../../../rbac-consts";

import { StyledVerificationCardWrapper } from "../../card-verification-list/styled-verification-card";

export const ClientDetailsCardContext = createContext();

const ClientDetailsCredit = ({ id }) => {
  let permissions = {};
  let history = useHistory();
  let searchParams = queryString.parse(history.location.search);

  const client = useApolloClient();

  const { userRole, managerCity } = client.readQuery({
    query: GET_USER_RBAC_DETAILS,
  });

  const [filter, setFilter] = useState(Object.fromEntries(Object.entries(searchParams).filter(([_, v]) => v != null && v !== "")));

  const handleChangeFilter = useCallback(
    (name, value) => {
      let object = name !== "cpage" ? { [name]: value, cpage: 1 } : { [name]: value };
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
      search: queryString.stringify({ ...filtered }),
    });
  }, [filter]);

  if ("manager" === userRole)
    permissions = { isBank: managerCity.includes("bank") };

  return (
    <Can
      role={userRole}
      perform={cardVerification.READ}
      data={permissions}
      yes={() => (
        <StyledVerificationCardWrapper role={userRole} className="client-verification-card">
          <ClientDetailsCardContext.Provider
            value={{ filter, handleChangeFilter, handleClearFilter }}
          >
            <ClientDetailsCreditFilter />
            <ClientDetailsCreditList id={id} />
          </ClientDetailsCardContext.Provider>
        </StyledVerificationCardWrapper>
      )}
      no={() => <AlertMessage type="error" message="Недостаточно прав" />}
    />
  );
};

export default ClientDetailsCredit;