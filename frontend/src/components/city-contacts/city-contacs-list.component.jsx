import React, { useContext, useState } from "react";
import { useQuery } from "@apollo/react-hooks";
import Spinner from "../spinner/spinner.component";
import AlertMessage from "../alert/alert.component";
import {
  StyledColHead,
  StyledScrollTable,
  StyledTable,
  StyledTableBody,
  StyledTableHeader
} from "../styles/styled-table";
import CityContactItem from "./city-contact-item.component";
import CustomPagination from "../pagination/pagination.component";
import { useHistory } from "react-router-dom";
import queryString from "query-string";
import { CityContactsFilterContext } from "./city-contacs.container";
import { GET_CITY_CONTACTS } from "../../graphql/queries/city-contact.query";
import FragmentSpinner from "../spinner/fragment-spinner.component";
import { StyledContactFieldTable } from "../../pages/city-contacs/styled-city-contacts";

const CityContactsList = ({ cityContactFields, editMode, setEditMode }) => {
  let history = useHistory();

  const { filter } = useContext(CityContactsFilterContext);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const { page, itemsPerPage, ...props } = filter;

  const currentPage = page ? parseInt(page) : 1;

  const {
    data,
    error,
    loading,
    fetchMore
  } = useQuery(GET_CITY_CONTACTS, {
    variables: {
      ...props,
      itemsPerPage: itemsPerPage ? +itemsPerPage : 50,
      page: currentPage,
    },
    fetchPolicy: "network-only",
    errorPolicy: "ignore"
  });

  const handlePaginationChange = (page) => {
    setIsLoadingMore(true);
    fetchMore({
      variables: { page },
      updateQuery: (prev, { fetchMoreResult }) => {
        setIsLoadingMore(false);
        if (!fetchMoreResult) return prev;
        return fetchMoreResult;
      }
    });
    history.replace({
      search: queryString.stringify({ page, ...filter })
    });
  };

  if (loading) return <Spinner color="#EC6110" type="moonLoader" size="50px" />;
  if (error) return <AlertMessage type="error" message={error.message} />;
  if (!data) return <></>;

  const { collection, paginationInfo } = data.cityContacts;

  if (!collection) return <Spinner color="#EC6110" type="moonLoader" size="50px" />;
  if (collection.length === 0) return <AlertMessage type="warning" message="Контакты отсутствуют" margin="15px 0 0" />;

  const { totalCount } = paginationInfo;

  return (
    <StyledScrollTable>
      {isLoadingMore && <FragmentSpinner position="center" />}
      <StyledContactFieldTable col={cityContactFields.length + 3}>
        <StyledTable width="1280" className={`contact-fields-table ${!editMode && "contact-fields-table_edit"}`}>
          <StyledTableHeader scroll="auto" col={cityContactFields.length + 3} className="contact-fields-table__head">
            <StyledColHead>Город</StyledColHead>
            {cityContactFields.map((contactField, key ) =>
              (
                <StyledColHead key={key}>{contactField.name}</StyledColHead>
              ))}
            <StyledColHead>Публикация</StyledColHead>
            <StyledColHead>Активность</StyledColHead>
          </StyledTableHeader>
          <StyledTableBody>
            {cityContactFields && collection &&
            collection.map((cityContact, key) => (
              <CityContactItem
                editMode={editMode}
                setEditMode={setEditMode}
                key={`${key}__${cityContact.id}`}
                cityFieldsList={cityContactFields}
                cityContact={cityContact}
              />))}
          </StyledTableBody>
        </StyledTable>
      </StyledContactFieldTable>
      <CustomPagination
        total={totalCount}
        pageSize={itemsPerPage ? itemsPerPage : 50}
        onPaginationPageChange={handlePaginationChange}
        currentPage={currentPage}
        loading={loading} //{loading || fetchLoading} - if need
      />
    </StyledScrollTable>
  );
};

export default CityContactsList;