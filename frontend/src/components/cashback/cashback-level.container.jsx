import React, { useEffect, useState } from "react";
import CashbackLevelForm from "./cashback-level-form.container";
import CashbackLevelList from "./cashback-level-list.container";
import { useHistory } from "react-router-dom";
import { pageToUrl } from "../../graphql/pagination.utils";


const CashbackLevelContainer = () => {
  let history = useHistory();
  let searchParams = new URLSearchParams(history.location.search);
  let currentPage = parseInt(searchParams.get("cashbackPage") ?? 1);

  const [paginationInfo, setPaginationInfo] = useState({
    totalCount: 0,
    currentPage: currentPage,
    itemsPerPage: 10,
    lastPage: 1
  })

  useEffect(() => {
    setPaginationInfo(prevState => {
      return {
        ...prevState, currentPage: currentPage,
      }
    });
    pageToUrl(history, "cashbackPage", currentPage);
  }, [currentPage]);

  useEffect(() => {
    pageToUrl(history, "cashbackPage", paginationInfo.currentPage);
  }, [paginationInfo.currentPage]);

  useEffect(() => {
    if(paginationInfo.totalCount) {
      const page = Math.ceil(paginationInfo.totalCount / paginationInfo.itemsPerPage);

      setPaginationInfo(prevState => {
        return {
          ...prevState, currentPage: page,
        }
      });

    }
  }, [paginationInfo.totalCount]);

  return (
    <>
      <CashbackLevelForm setPaginationInfo={setPaginationInfo} />
      <CashbackLevelList paginationInfo={paginationInfo} setPaginationInfo={setPaginationInfo} />
    </>
  );
};

export default CashbackLevelContainer;