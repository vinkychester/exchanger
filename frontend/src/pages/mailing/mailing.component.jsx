import React, { createContext, useCallback, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useQuery, useApolloClient } from "@apollo/react-hooks";
import queryString from "query-string";

import Can from "../../components/can/can.component";
import ForbiddenPage from "../forbidden/forbidden.component";
import Title from "../../components/title/title.component";
import MailingFilter from "../../components/mailing/mailing-filter.component";
import MailingForm from "../../components/mailing/mailing-form.component";
import MailingList from "../../components/mailing/mailing-list.component";

import { StyledContainer } from "../../components/styles/styled-container";
import { StyledMailingWrapper } from "../../components/mailing/styled-mailing";

import { GET_USER_RBAC_DETAILS } from "../../graphql/queries/user.query";
import { mailing } from "../../rbac-consts";

export const MailingFilterContext = createContext();

const MailingPage = () => {
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
  const [hide, setHide] = useState(true);

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

  const showForm = () => {
    hide ? setHide(false) : setHide(true);
  };

  return (
    <Can
      role={userRole}
      perform={mailing.READ}
      yes={() => (
        <StyledContainer size="xl">
          <Helmet>
            <title>Рассылка - Coin24</title>
          </Helmet>
          <StyledMailingWrapper>
            <Title as="h1" title="Рассылка" className="mailing-title" />
            <MailingFilterContext.Provider
              value={{ filter, handleClearFilter, handleChangeFilter }}
            >
              <MailingFilter showForm={showForm} />
              <MailingForm hide={hide} setHide={setHide} />
              <MailingList />
            </MailingFilterContext.Provider>
          </StyledMailingWrapper>
        </StyledContainer>
      )}
      no={() => <ForbiddenPage />}
    />
  );
};

export default React.memo(MailingPage);
