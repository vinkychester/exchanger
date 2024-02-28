import React, { useContext, useEffect } from "react";
import { useQuery } from "@apollo/react-hooks";

import AlertMessage from "../alert/alert.component";
import CalculatorSkeletonPairContent from "./skeleton/calculator-skeleton-pair-content";
import CalculatorContentItem from "./calculator-content-item.component";

import { StyledTabContent } from "./styled-calculator";

import { GET_ACTIVE_PAIR_UNITS_BY_DIRECTION } from "../../graphql/queries/pair-unit.query";
import { CalculatorTabContext } from "./calculator.component";
import { findPairUnitsByTab } from "../../utils/calculator.utils";
import { mercureUrl } from "../../utils/response";

const CalculatorContent = () => {
  const { direction, tab } = useContext(CalculatorTabContext);

  const includePayment = "payment" === direction;
  const includePayout = "payout" === direction;

  mercureUrl.searchParams.append("topic", `http://coin24/pair_unit`);

  const { data, loading, error, refetch } = useQuery(
    GET_ACTIVE_PAIR_UNITS_BY_DIRECTION,
    {
      variables: { direction, includePayment, includePayout },
      fetchPolicy: "network-only"
    }
  );

  useEffect(() => {
    const eventSource = new EventSource(mercureUrl);
    eventSource.onmessage = (event) => {
      refetch({
        variables: { direction, includePayment, includePayout },
        // context: { fetchOptions: { signal }},
      });
    };

    return () => {
      eventSource.close();
    };
  }, []);

  if (loading) return <CalculatorSkeletonPairContent />;
  if (error)
    return (
      <StyledTabContent>
        <AlertMessage type="error" message="Error!" margin="0 3px 0 0" />
      </StyledTabContent>
    );
  if (!data)
    return (
      <StyledTabContent>
        <AlertMessage type="warning" message="Not found." margin="0 3px 0 0" />
      </StyledTabContent>
    );

  return (
    <StyledTabContent>
      <CalculatorContentItem
        collection={findPairUnitsByTab(
          data.calculatorCollectionQueryPairUnits.collection,
          tab
        )}
        data={data}
      />
    </StyledTabContent>
  );
};

export default React.memo(CalculatorContent);
