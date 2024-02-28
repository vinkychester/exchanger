import React, { createContext, useCallback, useEffect, useState } from "react";
import { useApolloClient } from "@apollo/react-hooks";
import { useHistory } from "react-router-dom";
import queryString from "query-string";
import "../../../assets/css/rc-select.css";

import Can from "../../can/can.component";
import PairFilter from "./pair-filter.component";
import PairForm from "./pair-form.component";
import PairList from "./pair-list.component";
import PairMultiply from "./pair-multiply.component";

import { GET_USER_RBAC_DETAILS } from "../../../graphql/queries/user.query";
import { paymentSettings } from "../../../rbac-consts";
import { StyledButton } from "../../styles/styled-button";

export const PairFilterContext = createContext();

const PairContainer = () => {
  const client = useApolloClient();

  let history = useHistory();
  let searchParams = queryString.parse(history.location.search);

  const { userRole } = client.readQuery({
    query: GET_USER_RBAC_DETAILS,
  });

  const [filter, setFilter] = useState(Object.fromEntries(Object.entries(searchParams).filter(([_, v]) => v != null && v !== "")));
  const [hideMultiActions, setHideMultiActions] = useState(true);
  const [hideCreateForm, setHideCreateForm] = useState(true);
  const [countChecked, setCountChecked] = useState(0);

  const handleChangeFilter = useCallback(
    (name, value) => {
      let object = name !== "ppage" ? { [name]: value, ppage: 1 } : { [name]: value };
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

  const currentPage = filter.ppage ? parseInt(filter.ppage) : 1;

  const showCreateForm = () => {
    hideCreateForm ? setHideCreateForm(false) : setHideCreateForm(true);
  };

  const showMultiActions = () => {
    hideMultiActions ? setHideMultiActions(false) : setHideMultiActions(true);
  };

  return (
    <PairFilterContext.Provider
      value={{ filter, currentPage, handleClearFilter, handleChangeFilter, setCountChecked, countChecked }}
    >
      <Can
        role={userRole}
        perform={paymentSettings.CREATE_PAIR}
        yes={() =>
          <div className="payment-settings-actions">
            <div className="payment-settings-actions__top">
              <StyledButton type="button" color="main" onClick={showCreateForm}>
                Создать пару
              </StyledButton>
              <StyledButton type="button" weight="normal" onClick={showMultiActions}>
                Множественный выбор
              </StyledButton>
            </div>
            <PairForm hideCreateForm={hideCreateForm}/>
            <PairMultiply hideMultiActions={hideMultiActions}/>
          </div>}
      />
      <PairFilter />
      <PairList />
    </PairFilterContext.Provider>
  );
};

export default PairContainer;
