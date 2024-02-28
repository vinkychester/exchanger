import React, { createContext, useCallback, useEffect, useState } from "react";
import { NavLink, useHistory } from "react-router-dom";
import Title from "../../title/title.component";
import BreadcrumbItem from "../../breadcrumb/breadcrumb-item";
import ReferralReportList from "./client-referral-report-list.component";
import ClientReferralReportFilter from "./client-referral-report-filter.component";
import queryString from "query-string";

import { StyledReportsWrapper } from "../styled-reports";
import { StyledBreadcrumb } from "../../styles/styled-breadcrumb";
import { StyledContainer } from "../../styles/styled-container";

export const ReferralsFilterContext = createContext();
const ClientReferralReport = ({ match }) => {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");

  const history = useHistory();
  const searchParams = queryString.parse(history.location.search);
  const [filter, setFilter] = useState(Object.fromEntries(Object.entries(searchParams).filter(([_, v]) => v != null && v !== "")));

  useEffect(() => {
    let filtered = Object.fromEntries(Object.entries(filter).filter(([_, v]) => v != null && v !== ""));
    history.replace({
      search: queryString.stringify({ ...filtered })
    });
  }, [filter]);

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

  return (
    <ReferralsFilterContext.Provider
      value={{ filter, handleChangeFilter, handleClearFilter, match }}
    >
      <StyledContainer size="xl">
        <StyledReportsWrapper>
          <Title
            as="h1"
            title={`Реферальные клиенты ${match.params.referralLevel} уровня`}
            className="reports-title"
          />
          <StyledBreadcrumb className="reports-breadcrumb">
            <BreadcrumbItem as={NavLink} to="/" title="Главная" />
            <BreadcrumbItem as={NavLink} to="/panel/reports" title="Отчеты" />
            <BreadcrumbItem as="span" title={`${firstname} ${lastname}`} />
          </StyledBreadcrumb>
          <ClientReferralReportFilter
            setFilter={setFilter}
            filter={filter}
          />
          <ReferralReportList
            setFirstname={setFirstname}
            setLastname={setLastname}
          />
        </StyledReportsWrapper>
      </StyledContainer>
    </ReferralsFilterContext.Provider>
  );
};

export default ClientReferralReport;
