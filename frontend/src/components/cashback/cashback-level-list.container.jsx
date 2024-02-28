import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/react-hooks";
import { GET_ALL_CASHBACK_LEVELS } from "../../graphql/queries/cashback-level.query";
import CashbackLevelItem from "./cashback-level-item.container";
import {
  StyledColHead,
  StyledScrollTable,
  StyledTable,
  StyledTableBody,
  StyledTableHeader
} from "../styles/styled-table";
import CustomPagination from "../pagination/pagination.component";
import { useHistory } from "react-router-dom";

const CashbackLevelList = ({ paginationInfo, setPaginationInfo }) => {
  const [cashbackLevels, setCashbackLevels] = useState(null);

  let history = useHistory();
  const { currentPage, lastPage, totalCount, itemsPerPage } = paginationInfo;

  const { refetch, loading } = useQuery(GET_ALL_CASHBACK_LEVELS, {
    variables: {
      page: currentPage > +lastPage ? +lastPage : currentPage,
      itemsPerPage: itemsPerPage
    },
    fetchPolicy: "cache-and-network",
    onCompleted: data => {
      if (data.cashbackLevels.collection.length > 0) {
        setCashbackLevels(data.cashbackLevels.collection);
        setPaginationInfo(prevState => {
            return { ...prevState, ...data.cashbackLevels.paginationInfo };
          }
        );
      }
    }
  });

  const onPaginationPageChange = (page) => {
    const url = new URL(window.location.href);
    url.searchParams.set("cashbackPage", page.toString());

    history.push({
      pathname: url.pathname,
      search: url.search
    });
  };

  useEffect(() => {
    if (refetch) {
      refetch();
    }
  }, [totalCount]);

  return (
    <>
      <StyledScrollTable>
        <StyledTable
          width="1280"
          className="admin-cashback-table"
        >
          <StyledTableHeader
            scroll="auto"
            col="7"
            className="admin-cashback-table__head"
          >
            <StyledColHead>Статус</StyledColHead>
            <StyledColHead>Имя уровня</StyledColHead>
            <StyledColHead>Уровень</StyledColHead>
            <StyledColHead>Процент</StyledColHead>
            <StyledColHead>С этого количества средств</StyledColHead>
            <StyledColHead>По это количество средств</StyledColHead>
            <StyledColHead/>
          </StyledTableHeader>

          <StyledTableBody>
            {cashbackLevels && cashbackLevels.map(
              cashbackLevel => (
                <CashbackLevelItem
                  key={cashbackLevel.id}
                  refetchCashbackLevels={refetch}
                  setPaginationInfo={setPaginationInfo}
                  cashbackLevel={cashbackLevel}
                />
              )
            )}
          </StyledTableBody>

          {!loading && lastPage && lastPage > 1 ? (
            <CustomPagination
              total={+totalCount}
              pageSize={+itemsPerPage}
              onPaginationPageChange={onPaginationPageChange}
              currentPage={+currentPage}
            />
          ) : <></>
          }
        </StyledTable>
      </StyledScrollTable>
    </>
  );
};

export default CashbackLevelList;