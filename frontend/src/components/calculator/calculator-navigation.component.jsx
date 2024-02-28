import React, { useContext } from "react";
import Tooltip from "rc-tooltip";
import { useQuery } from "@apollo/react-hooks";
import AlertMessage from "../alert/alert.component";
import CalculatorSkeletonNavigation from "./skeleton/calculator-skeleton-navigation";
import { CalculatorTooltips } from "../../utils/calculatorTooltips.utils";

import { StyledTabNavigation, StyledTabNavItem } from "./styled-calculator";

import { GET_PAIR_UNIT_TABS } from "../../graphql/queries/pair-unit-tab.query";
import { CalculatorTabContext } from "./calculator.component";
import { CalculatorContentContext } from "./calculator-tab.component";

const CalculatorNavigation = () => {
  const { direction, tab } = useContext(CalculatorTabContext);
  const { handleChangeTab } = useContext(CalculatorContentContext);
  const { data, loading, error } = useQuery(GET_PAIR_UNIT_TABS);

  if (loading) return <CalculatorSkeletonNavigation />;
  if (error) return <AlertMessage type="error" message="Error!" />;
  if (!data) return <AlertMessage type="warning" message="Not found." />;

  const { pairUnitTabs } = data;

  return (
    <StyledTabNavigation value={tab}>
      {pairUnitTabs &&
        pairUnitTabs.map(({ id, name }) => (
          <Tooltip
            key={id}
            overlayClassName="orange-tooltip"
            color={`#87d068`}
            mouseEnterDelay={0.75}
            placement="top"
            overlay={CalculatorTooltips(direction, name)}
          >
            <StyledTabNavItem
              key={id}
              className={tab === name ? "selected" : null}
              htmlFor={name + "-" + direction}
            >
              <div className="exchange-type-name">{name}</div>
              <input
                type="radio"
                value={name}
                id={name + "-" + direction}
                hidden="hidden"
                onClick={(event) => handleChangeTab(event.target.value)}
              />
            </StyledTabNavItem>
          </Tooltip>

        ))}
      <Tooltip
        overlayClassName="orange-tooltip"
        color={`#87d068`}
        mouseEnterDelay={0.75}
        placement="top"
        overlay={CalculatorTooltips('All')}
      >
        <StyledTabNavItem
          className={tab === "all" ? "selected" : null}
          htmlFor={`all-${direction}`}
        >
          <span>all</span>
          <input
            type="radio"
            value="all"
            id={`all-${direction}`}
            hidden="hidden"
            onClick={(event) => handleChangeTab(event.target.value)}
          />
        </StyledTabNavItem>
      </Tooltip>
    </StyledTabNavigation>
  );
};

export default React.memo(CalculatorNavigation);
