import React, { createContext, useCallback, useEffect, useState } from "react";
import { useApolloClient } from "@apollo/react-hooks";
import { useHistory } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import queryString from "query-string";

import Can from "../../components/can/can.component";
import ForbiddenPage from "../forbidden/forbidden.component";
import Title from "../../components/title/title.component";
import CardVerificationForm from "../../components/card-verification-list/card-verification-form.component";
import CardVerificationFilter from "../../components/card-verification-list/card-verification-filter.component";
import CardVerificationList from "../../components/card-verification-list/card-verification-list.component";

import { StyledVerificationCardWrapper } from "../../components/card-verification-list/styled-verification-card";
import { StyledContainer } from "../../components/styles/styled-container";

import { GET_USER_RBAC_DETAILS } from "../../graphql/queries/user.query";
import { cardVerification } from "../../rbac-consts";
import { creditCardStatuses } from "../../utils/consts.util";

export const CardVerificationContext = createContext();

const CardVerificationPage = () => {
  const client = useApolloClient();

  let permissions = {};
  let statusCardVerification = {};
  let history = useHistory();
  let searchParams = queryString.parse(history.location.search);

  const { userRole, managerCity } = client.readQuery({
    query: GET_USER_RBAC_DETAILS,
  });

  let params = Object.fromEntries(
    Object.entries(searchParams).filter(([_, v]) => v != null && v !== "")
  );

  switch (userRole) {
    case "client":
      statusCardVerification = { status: null };
      break;
    default:
      statusCardVerification = { status: params.status ?? creditCardStatuses.NOT_VERIFIED };
  }

  const [hide, setHide] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [filter, setFilter] = useState({
    ...params,
    ...statusCardVerification
  });

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

  const currentPage = filter.page ? parseInt(filter.page) : 1;

  if ("manager" === userRole)
    permissions = { isBank: managerCity.includes("bank") };

  const showForm = () => {
    hide ? setHide(false) : setHide(true);
  };

  return (
    <Can
      role={userRole}
      perform={cardVerification.READ}
      data={permissions}
      yes={() => (
        <StyledContainer size={userRole !== "client" ? "xl" : null}>
          <Helmet>
            <title>Верификация карт - Coin24</title>
          </Helmet>
          <StyledVerificationCardWrapper role={userRole}>
            <Title
              as="h1"
              title="Верификация карт"
              description="Проверка"
              className="card-verification-title"
            />
            <CardVerificationContext.Provider
              value={{
                filter,
                currentPage,
                handleChangeFilter,
                handleClearFilter,
                totalCount,
                setTotalCount,
              }}
            >
              <CardVerificationFilter showForm={showForm} />
              <Can
                role={userRole}
                perform={cardVerification.CREATE}
                yes={() => (
                  <CardVerificationForm hide={hide} setHide={setHide} />
                )}
              />
              <CardVerificationList />
            </CardVerificationContext.Provider>
          </StyledVerificationCardWrapper>
        </StyledContainer>
      )}
      no={() => <ForbiddenPage />}
    />
  );
};

export default React.memo(CardVerificationPage);
