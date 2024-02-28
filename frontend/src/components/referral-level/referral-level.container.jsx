import React, {useContext, useEffect, useState} from "react";
import ReferralLevelList from "./referral-level-list.component";
import ReferralLevelForm from "./referral-level-form.component";
import {useHistory} from "react-router-dom";
import {pageToUrl} from "../../graphql/pagination.utils";

export const PaginationContext = React.createContext({
  currentPage: 1,
  itemsPerPage: 10
});

const ReferralLevelContainer = () => {
  let history = useHistory();
  let searchParams = new URLSearchParams(history.location.search);
  let currentPage = parseInt(searchParams.get("page") ?? 1);

  const paginationContext = useContext(PaginationContext);

  const [paginationInfo, setPaginationInfo] = useState({
    ...paginationContext,
    currentPage,
    totalCount: null,
    lastPage: 1
  });

  useEffect(() => {
    setPaginationInfo(prevState => {
      return {
        ...prevState, currentPage: currentPage,
      }
    });
    pageToUrl(history, "page", currentPage);
  }, [currentPage]);

  useEffect(() => {
    pageToUrl(history, "page", paginationInfo.currentPage);
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
      <PaginationContext.Provider value={{paginationInfo: paginationInfo, setPaginationInfo: setPaginationInfo}}>
        <ReferralLevelForm />
        <ReferralLevelList />
      </PaginationContext.Provider>
  );
};

export default ReferralLevelContainer;