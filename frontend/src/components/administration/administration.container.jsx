import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import AdministrationList from "./administration-list.component";
import { StyledAdministrationContent } from "./styled-administration-page";
import AdministrationNavigation from "./administration.navigation";
import queryString from "query-string";
import { useLazyQuery, useMutation, useApolloClient } from "@apollo/react-hooks";
import { GET_USER_BY_DISCR, GET_USER_RBAC_DETAILS } from "../../graphql/queries/user.query";
import AdministrationFilter from "./AdministrationFilter";
import CustomPagination from "../pagination/pagination.component";
import { UPDATE_MANAGER_BANNED } from "../../graphql/mutations/client.mutation";
import { closableNotificationWithClick } from "../notification/closable-notification-with-click.component";
import ManagersBankPercent from "./manager-details/managers-bank-percent";

export const PaginationContext = React.createContext({
  currentPage: 1,
  itemsPerPage: 9
});

const AdministrationContainer = ({ shouldRefetch, setShouldRefetch, ...props }) => {
  let history = useHistory();
  let searchParams = queryString.parse(history.location.search);
  const [filter, setFilter] = useState(searchParams);

  const client = useApolloClient();

  const { userRole } = client.readQuery({
    query: GET_USER_RBAC_DETAILS,
  });

  let currentPage = parseInt(searchParams[props.type + "page"] ?? 1);
  const paginationContext = useContext(PaginationContext);

  const [paginationInfo, setPaginationInfo] = useState({
    ...paginationContext,
    currentPage
  });

  const onPaginationPageChange = (page) => {
    setPaginationInfo((prevState) => ({
      ...prevState,
      currentPage: page
    }));
    setFilter((prevState) => ({
      ...prevState,
      [props.type + "page"]: page
    }));
  };

  const prepareParamsToQuery = (filter) => {
    let preparedParams = {};
    if (filter[props.type + "dateFrom"]) {
      let myDate = filter[props.type + "dateFrom"].split("-");
      preparedParams.dateFrom = (new Date(myDate[2], myDate[1] - 1, myDate[0]).getTime() / 1000).toString();
    }
    if (filter[props.type + "dateTo"]) {
      let myDate = filter[props.type + "dateTo"].split("-");
      preparedParams.dateTo = (new Date(myDate[2], myDate[1] - 1, parseInt(myDate[0]) + 1).getTime() / 1000).toString();
    }
    preparedParams.itemsPerPage = paginationInfo.itemsPerPage;

    if (!!filter[props.type + "page"]) {
      preparedParams.page = parseInt(filter[props.type + "page"]);
    }
    if (filter[props.type + "firstname"]) {
      preparedParams.firstname = filter[props.type + "firstname"];
    }
    if (filter[props.type + "lastname"]) {
      preparedParams.lastname = filter[props.type + "lastname"];
    }
    if (filter[props.type + "email"]) {
      preparedParams.email = filter[props.type + "email"];
    }
    preparedParams.discr = props.discr;
    return preparedParams;
  };

  const getPageOnRemove = (currentPage) => {

    let calculatedPage = Math.ceil((data.users.paginationInfo.totalCount - 1) / paginationInfo.itemsPerPage);

    if (currentPage > data.users.paginationInfo.lastPage) {
      currentPage = data.users.paginationInfo.lastPage;
    } else if (currentPage > calculatedPage) {
      currentPage = calculatedPage;
    }
    if (currentPage < 1) return 1;

    return currentPage;
  };

  const [executeSearch, { loading, error, data }] = useLazyQuery(GET_USER_BY_DISCR,
    {
      variables: {
        discr: props.discr,
        isBanned: props.isBanned
      },
      fetchPolicy: "cache-and-network"
    });

  const [updateManagerBanned] = useMutation(UPDATE_MANAGER_BANNED, {
    onCompleted: () => {
      closableNotificationWithClick("Статус изменен", "success");
      onPaginationPageChange(
        getPageOnRemove(paginationInfo.currentPage)
      );
      setShouldRefetch(1);
    }
  });

  useEffect(() => {
      history.replace({
        search: queryString.stringify(filter)
      });
      executeSearch({ variables: prepareParamsToQuery(filter) });
    }, [filter]
  );

  useEffect(() => {
    if (!!shouldRefetch) {
      executeSearch({ variables: prepareParamsToQuery(filter) });
    }
    setShouldRefetch(0);
  }, [shouldRefetch]);

  return (
    <React.Fragment>
      <PaginationContext.Provider value={{ paginationInfo, setPaginationInfo, updateManagerBanned }}>
        <AdministrationFilter
          filter={filter}
          setFilter={setFilter}
          pagePrefix={props.type}
          count={data?.users.paginationInfo.totalCount}
          name={props.discr}
        />

        <StyledAdministrationContent>
          <AdministrationNavigation />
          <div className="administration-list-wrapper">
            {userRole === "admin" && props.discr === "manager" && <ManagersBankPercent userRole={userRole} />}
            <AdministrationList
              data={data}
              error={error}
              loadingData={loading}
              discr={props.discr}
              type={props.type}
            />
            {(!loading && !!data && data.users && data.users.paginationInfo.lastPage > 1) ? (
              <CustomPagination
                total={data.users.paginationInfo.totalCount}
                pageSize={paginationInfo.itemsPerPage}
                currentPage={paginationInfo.currentPage}
                onPaginationPageChange={onPaginationPageChange}
              />
            ) : (
              <></>
            )}
          </div>
        </StyledAdministrationContent>
      </PaginationContext.Provider>
    </React.Fragment>
  );
};

export default AdministrationContainer;
