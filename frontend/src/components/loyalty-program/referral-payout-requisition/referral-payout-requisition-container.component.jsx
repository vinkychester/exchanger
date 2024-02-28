import React, { useCallback, useContext, useEffect, useState } from "react";

import { useLazyQuery, useMutation } from "@apollo/react-hooks";
import { GET_ALL_PAYOUT_REQUISITIONS } from "../../../graphql/queries/payout-requisitions.query";
import { UPDATE_PAYOUT_REQUISITION } from "../../../graphql/mutations/payout-requisition.mutation";
import ReferralPayoutRequisitionFilter from "./referal-payout-requisition-filter.component";
import CustomPagination from "../../pagination/pagination.component";
import { useHistory } from "react-router-dom";
import queryString from "query-string";
import ReferralPayoutRequisitionList from "./referal-payout-requisition-list.component";
import { parseApiErrors } from "../../../utils/response";
import { refineParams } from "../../../utils/filter.utils";
import { closableNotificationWithClick } from "../../notification/closable-notification-with-click.component";

export const PaginationContext = React.createContext({
  currentPage: 1,
  itemsPerPage: 10
});

const ReferralPayoutRequisitionContainer = () => {

  const history = useHistory();

  const [errors, setErrors] = useState("");

  let searchParams = queryString.parse(history.location.search);
  const [filter, setFilter] = useState(searchParams);
  let currentPage = parseInt(searchParams.requisitionPage ?? 1);
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
      requisitionPage: page
    }));
  };

  const prepareParamsToQuery = (filter) => {

    let preparedParams = {
      itemsPerPage: paginationInfo.itemsPerPage,
      page: (filter.requisitionPage ? parseInt(filter.requisitionPage) : 1),
      status: filter.requisitionStatus,
      amountFrom: filter.requisitionAmountFrom,
      amountTo: filter.requisitionAmountTo,
      firstname: filter.requisitionFirstName,
      lastname: filter.requisitionLastName
    };

    if (filter.requisitionDateFrom) {
      let myDate = filter.requisitionDateFrom.split("-");
      preparedParams.dateFrom = (new Date(myDate[2], myDate[1] - 1, myDate[0]).getTime() / 1000).toString();
    }
    if (filter.requisitionDateTo) {
      let myDate = filter.requisitionDateTo.split("-");
      preparedParams.dateTo = (new Date(myDate[2], myDate[1] - 1, parseInt(myDate[0]) + 1).getTime() / 1000).toString();
    }

    return refineParams(preparedParams);
  };

  const [executeSearch, { data, loading, error }] = useLazyQuery(GET_ALL_PAYOUT_REQUISITIONS,
    {
      variables: {},
      fetchPolicy: "cache-and-network"
    }
  );

  const [updatePayoutRequisition] = useMutation(UPDATE_PAYOUT_REQUISITION, {
    onCompleted: data => {
      closableNotificationWithClick(
        "Статус заявки успешно изменен!",
        "success"
      );
    },
    onError: ({ graphQLErrors }) => {
      let error = parseApiErrors(graphQLErrors);
      error.internal ? closableNotificationWithClick(error.internal, "error") : setErrors(parseApiErrors(graphQLErrors));
    },
    refetchQueries: [{ query: GET_ALL_PAYOUT_REQUISITIONS, variables: prepareParamsToQuery(filter) }]
  });

  const onUpdateAction = useCallback((id, status, commentary) => {
    updatePayoutRequisition(
      {
        variables: { id, status, commentary }
      }
    );
  });

  useEffect(() => {
      history.replace({
        search: queryString.stringify(filter)
      });
      executeSearch({ variables: prepareParamsToQuery(filter) });
    }, [filter]
  );

  return (
    <React.Fragment>
      <ReferralPayoutRequisitionFilter
        filter={filter}
        setFilter={setFilter}
      />
      <ReferralPayoutRequisitionList
        data={data}
        error={error}
        loading={loading}
        onUpdateAction={onUpdateAction}
      />
      {(!loading && !!data && data.payoutRequisitions && data.payoutRequisitions.paginationInfo.lastPage > 1) ? (
        <CustomPagination
          total={data.payoutRequisitions.paginationInfo.totalCount}
          pageSize={paginationInfo.itemsPerPage}
          onPaginationPageChange={onPaginationPageChange}
          currentPage={paginationInfo.currentPage}
        />
      ) : (
        <></>
      )}
    </React.Fragment>
  );
};

export default ReferralPayoutRequisitionContainer;
