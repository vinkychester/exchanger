import React, { useCallback, useContext } from "react";
import { useMutation, useQuery } from "@apollo/react-hooks";

import AlertMessage from "../../alert/alert.component";
import PairUnitSkeleton from "../skeleton/pair-unit-skeleton.component";
import CustomPagination from "../../pagination/pagination.component";
import PairItem from "./pair-item.component";

// import "rc-checkbox/assets/index.css";
// import "rc-switch/assets/index.css";

import {
  StyledColHead,
  StyledScrollTable,
  StyledTable,
  StyledTableBody,
  StyledTableHeader
} from "../../styles/styled-table";

import { GET_ALL_PAIRS_WITH_IS_REQUISITION } from "../../../graphql/queries/pair.query";
import { DELETE_PAIR_BY_ID } from "../../../graphql/mutations/pair.mutation";
import { PairFilterContext } from "./pair.container";
import { StyledTooltip } from "../../styles/styled-tooltip";
import Tooltip from "rc-tooltip";
import { closableNotificationWithClick } from "../../notification/closable-notification-with-click.component";

const PairList = () => {
  const { handleChangeFilter, filter, currentPage } = useContext(PairFilterContext);
  const { pitemsPerPage } = filter;
  const object = Object.entries(filter).reduce((a, [k, v]) => (a[k.slice(1)] = v, a), {});
  const { active, ...props } = object;

  const { data, loading, error } = useQuery(
    GET_ALL_PAIRS_WITH_IS_REQUISITION,
    {
      variables: {
        ...props,
        itemsPerPage: pitemsPerPage ? +pitemsPerPage : 50,
        page: currentPage,
        active: active ? active === "true" : null,
      },
      fetchPolicy: "network-only",
    }
  );

  const handlePaginationChange = (page) => {
    handleChangeFilter("ppage", page);
  };

  const [deletePair] = useMutation(DELETE_PAIR_BY_ID, {
    onCompleted: () => {
      closableNotificationWithClick("Пара успешно удалена", "success");
    },
    refetchQueries: () => [
      {
        query: GET_ALL_PAIRS_WITH_IS_REQUISITION,
        variables: {
          ...props,
          itemsPerPage: pitemsPerPage ? +pitemsPerPage : 50,
          page: getPageOnRemove(currentPage),
          active: active ? active === "true" : null,
        },
      },
    ],
  });

  const deletePairAction = useCallback((id) => {
    deletePair({ variables: { id } });
  }, []);

  if (loading) return <PairUnitSkeleton />;
  if (error) return <AlertMessage type="error" message={error.message} />;
  if (!data) return <AlertMessage type="warning" message="Not found." margin="15px 0 0" />;

  const { collection, paginationInfo } = data.pairs;

  if (!collection.length)
    return (
      <AlertMessage
        type="warning"
        message="Платежные пары отсутствуют."
        margin="15px 0"
      />
    );

  const { totalCount, lastPage } = paginationInfo;

  const getPageOnRemove = (currentPage) => {
    const a = pitemsPerPage ? pitemsPerPage : 50;
    let calculatedPage = Math.ceil((totalCount - 1) / a);
    if (currentPage > lastPage) currentPage = lastPage;
    else if (currentPage > calculatedPage) currentPage = calculatedPage;
    if (currentPage < 1) return 1;
    handleChangeFilter("ppage", currentPage);
    return currentPage;
  };

  return (
    <>
      <StyledScrollTable>
        <StyledTable width="1280" className="pairs-table">
          <StyledTableHeader
            scroll="auto"
            col="6"
            className="pairs-table__head"
          >
            <StyledColHead>Применить к</StyledColHead>
            <StyledColHead>Активные</StyledColHead>
            <StyledColHead>Отдал (IN)</StyledColHead>
            <StyledColHead>Получил (OUT)</StyledColHead>
            <StyledColHead>Топ</StyledColHead>
            <StyledColHead>
              Процент
              <Tooltip placement="top" overlay="Процент заработка системы">
                <StyledTooltip className="icon-question" opacity="0.5" />
              </Tooltip>
            </StyledColHead>
            <StyledColHead />
          </StyledTableHeader>
          <StyledTableBody>
            {collection &&
              collection.map(({ ...props }, key) => (
                <PairItem
                  key={key}
                  {...props}
                  deletePairAction={deletePairAction}
                />
              ))}
          </StyledTableBody>
        </StyledTable>
      </StyledScrollTable>
      <CustomPagination
        total={totalCount}
        pageSize={pitemsPerPage ? pitemsPerPage : 50}
        onPaginationPageChange={handlePaginationChange}
        currentPage={currentPage}
      />
    </>
  );
};

export default PairList;
