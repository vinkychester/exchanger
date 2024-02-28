import React, { createContext, useCallback, useEffect, useState } from "react";
import { useQuery, useApolloClient } from "@apollo/react-hooks";
import { useHistory } from "react-router-dom";
import queryString from "query-string";

import Spinner from "../spinner/spinner.component";
import AlertMessage from "../alert/alert.component";
import CityContactsList from "./city-contacs-list.component";
import CityContactForm from "./city-contacts-form.component";
import CityContactsFilter from "./city-contacs-filter.component";

import { StyledCityContactsList } from "../../pages/city-contacs/styled-city-contacts";

import { GET_USER_RBAC_DETAILS } from "../../graphql/queries/user.query";
import { GET_CITY_CONTACT_FIELDS_LIST } from "../../graphql/queries/city-contact-filed.query";

export const CityContactsFilterContext = createContext();

const CityContactsContainer = () => {
  let history = useHistory();
  let searchParams = queryString.parse(history.location.search);

  const client = useApolloClient();

  const { userRole } = client.readQuery({
    query: GET_USER_RBAC_DETAILS,
  });

  const { data, error, loading } = useQuery(GET_CITY_CONTACT_FIELDS_LIST, {
    fetchPolicy: "network-only"
  });

  const [hideForm, setHideForm] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [filter, setFilter] = useState(Object.fromEntries(Object.entries(searchParams).filter(([_, v]) => v != null && v !== "")));

  const handleChangeFilter = useCallback(
    (name, value) => {
      setFilter((prevState) => ({
        ...prevState,
        [name]: value
      }));
    },
    [filter]
  );

  const handleClearFilter = useCallback(() => {
    setFilter({});
  }, [filter]);

  useEffect(() => {
    let filtered =  Object.fromEntries(Object.entries(filter).filter(([_, v]) => v != null && v !== ""));
    history.replace({
      search: queryString.stringify({ ...filtered })
    });
  }, [filter]);

  if (loading) return <Spinner color="#EC6110" type="moonLoader" size="50px" />;
  if (error) return <AlertMessage type="error" message={error.message} />;
  if (!data) return <></>;

  const { cityContactFields } = data;

  if (!cityContactFields.length)
    return <AlertMessage type="info" message="Нет перечня городов" margin="15px 0" />;

  return (
    <StyledCityContactsList>
      <CityContactsFilterContext.Provider
        value={{ filter, handleChangeFilter, handleClearFilter }}
      >
        <CityContactForm
          cityContactFields={cityContactFields}
          hideForm={hideForm}
          setHideForm={setHideForm}
          setEditMode={setEditMode}
          editMode={editMode}
        />
        <CityContactsFilter
          cityContactFields={cityContactFields}
        />
        <CityContactsList
          cityContactFields={cityContactFields}
          editMode={editMode}
          setEditMode={setEditMode}
        />
      </CityContactsFilterContext.Provider>
    </StyledCityContactsList>
  );
};

export default CityContactsContainer;