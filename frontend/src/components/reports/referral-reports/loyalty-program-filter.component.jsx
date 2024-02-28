import React, { useContext, useState } from "react";
import DelayInputComponent from "../../input-group/delay-input-group";

import {
  StyledFilterBlock,
  StyledFilterTitle,
  StyledFilterWrapper,
  StyledHiddenFilter,
  StyledHiddenFilterAction
} from "../../styles/styled-filter";
import { clearFilter, refineParams } from "../../../utils/filter.utils";
import { StyledButton } from "../../styles/styled-button";
import { SystemReportFilterContext } from "../system-reports/system-report.container";
import { ReferralReportFilterContext } from "./referral-reports.container";
import ItemsPerPageSelectComponent from "../../pagination/items-per-page-select.component";

const LoyaltyProgramFilter = () => {
  const { filter, handleChangeFilter, handleClearFilter } = useContext(
    ReferralReportFilterContext
  );

  const [hideFilter, setHideFilter] = useState(
    !Object.keys(filter).length || ("lpage" in filter && Object.keys(filter).length === 1)
  )

  const toggleFilter = () => {
    setHideFilter(!hideFilter);
  };

  const handleChangeInput = (event) => {
    const { name, value } = event.target;
    handleChangeFilter(name, value.trim());
  };

  const { firstname, lastname, email, pitemsPerPage } = filter;

  return (
    <StyledHiddenFilter>
      <StyledHiddenFilterAction col="2">
        <div className="filter-btn">
          <StyledButton
            color="main"
            type="button"
            title="Фильтр"
            weight="normal"
            onClick={toggleFilter}
          >
            <span className="icon-filter" /> Фильтр
          </StyledButton>
        </div>
        <ItemsPerPageSelectComponent
          name={"pitemsPerPage"}
          value={pitemsPerPage}
          handleChangeFilter={handleChangeFilter}
          user={true}
        />
      </StyledHiddenFilterAction>
      <StyledFilterWrapper hide={hideFilter}>
        <StyledFilterTitle>
          Фильтровать по:
        </StyledFilterTitle>
        <StyledFilterBlock>
          <div>
            <DelayInputComponent
              label="Имя"
              name="firstname"
              value={firstname ?? ""}
              autoComplete="off"
              debounceTimeout={600}
              handleChange={handleChangeInput}
            />
          </div>
          <div>
            <DelayInputComponent
              label="Фамилия"
              name="lastname"
              value={lastname ?? ""}
              autoComplete="off"
              debounceTimeout={600}
              handleChange={handleChangeInput}
            />
          </div>
          <div>
            <DelayInputComponent
              label="E-mail"
              name="email"
              value={email ?? ""}
              autoComplete="off"
              debounceTimeout={600}
              handleChange={handleChangeInput}
            />
          </div>
        </StyledFilterBlock>
        <StyledFilterBlock actions>
          <StyledButton
            type="button"
            color="main"
            className="clear-filter"
            title="Очистить фильтр"
            weight="normal"
            onClick={handleClearFilter}
          >
            <span className="icon-trash" /> Очистить фильтр
          </StyledButton>
        </StyledFilterBlock>
      </StyledFilterWrapper>
    </StyledHiddenFilter>
  );
};

export default LoyaltyProgramFilter;
