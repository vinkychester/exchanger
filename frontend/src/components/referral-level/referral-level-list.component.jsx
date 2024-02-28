import React, { useContext, useEffect, useState } from "react";
import { useQuery } from "@apollo/react-hooks";
import { GET_ALL_REFERRAL_LEVELS } from "../../graphql/queries/referral-level.query";
import Spinner from "../spinner/spinner.component";
import ReferralLevelItem from "./referral-level-item.component";
import { PaginationContext } from "./referral-level.container";
import { useHistory } from "react-router-dom";
import CustomPagination from "../pagination/pagination.component";

import {
  StyledColHead,
  StyledScrollTable,
  StyledTable,
  StyledTableBody,
  StyledTableHeader
} from "../styles/styled-table";

const ReferralLevelList = () => {
  const {
    paginationInfo: { currentPage, lastPage, totalCount, itemsPerPage },
    setPaginationInfo
  } = useContext(PaginationContext);

  let history = useHistory();

  const [referralLevels, setReferralLevels] = useState(null);
  const { data, loading, networkStatus, refetch } = useQuery(GET_ALL_REFERRAL_LEVELS,
    {
      onCompleted: data => {
        setReferralLevels(data.referralLevels.collection);
        setPaginationInfo(prevState => {
          return { ...prevState, ...data.referralLevels.paginationInfo };
        });
      },
      variables: {
        page: currentPage > +lastPage ? +lastPage : currentPage, itemsPerPage: itemsPerPage
      },
      fetchPolicy: "cache-and-network",
      notifyOnNetworkStatusChange: true
    });

  useEffect(() => {
    if (refetch) {
      refetch({
        variables: {
          page: currentPage, itemsPerPage: itemsPerPage
        }
      });
    }
  }, [totalCount]);

  const onPaginationPageChange = (page) => {
    const url = new URL(window.location.href);
    url.searchParams.set("page", page.toString());

    history.push({
      pathname: url.pathname,
      search: url.search
    });
  };

  return (
    <>
      <StyledScrollTable>
        <StyledTable
          width="1280"
          className="admin-referral-table"
        >
          <StyledTableHeader
            scroll="auto"
            col="5"
            className="admin-referral-table__head"
          >
            <StyledColHead>Статус</StyledColHead>
            <StyledColHead>Имя уровня</StyledColHead>
            <StyledColHead>Уровень</StyledColHead>
            <StyledColHead>Процент</StyledColHead>
            <StyledColHead />
          </StyledTableHeader>
          <StyledTableBody>
            {referralLevels
              ? referralLevels.map(referralLevel =>
                <ReferralLevelItem
                  key={referralLevel.id}
                  getAllReferralLevels={refetch}
                  referralLevel={referralLevel}
                />)
              : <Spinner
                color="#EC6110"
                type="moonLoader"
                size="50px"
              />
            }
          </StyledTableBody>
        </StyledTable>
      </StyledScrollTable>
      {data && !loading ?
        <CustomPagination
          total={+totalCount}
          pageSize={+itemsPerPage}
          onPaginationPageChange={onPaginationPageChange}
          currentPage={currentPage}
        /> :
        <Spinner
          color="#EC6110"
          type="moonLoader"
          size="25px"
        />
      }
    </>

  );
};

export default ReferralLevelList;