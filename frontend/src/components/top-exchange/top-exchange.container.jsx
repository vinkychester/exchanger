import React, { useEffect } from "react";
import { useQuery } from "@apollo/react-hooks";

import TopExchangeItemSkeleton from "./skeleton/top-exchange-item-skeleton";
import AlertMessage from "../alert/alert.component";
import TopExchangeList from "./top-exchange-list.component";

import { StyledTopExchangeWrapper } from "./styled-top-exchange";
import {
  StyledColHead,
  StyledTable,
  StyledTableBody,
  StyledTableHeader,
} from "../styles/styled-table";

import { GET_TOP_PAIRS } from "../../graphql/queries/pair.query";
import { mercureUrl } from "../../utils/response";

const TopExchangeContainer = () => {
  const { data, loading, error, refetch } = useQuery(GET_TOP_PAIRS, {
    fetchPolicy: "network-only",
  });

  mercureUrl.searchParams.append("topic", `http://coin24/rates`);

  useEffect(() => {
    const eventSource = new EventSource(mercureUrl);
    eventSource.onmessage = (event) => {
      refetch();
    };

    return () => {
      eventSource.close();
    };
  }, []);

  if (loading) return <TopExchangeItemSkeleton />;
  if (error) return <AlertMessage type="error" message="Error" />;
  if (!data) return <AlertMessage type="warning" message="Not found." />;

  const { collection } = data.pairs;

  if (!collection.length)
    return (
      <AlertMessage type="info" message="Нет платежных пар." margin="15px 0" />
    );

  return (
    <StyledTopExchangeWrapper>
      <StyledTable className="top-exchange-table">
        <StyledTableHeader col="5" className="top-exchange-table__head">
          <StyledColHead>Отдаете</StyledColHead>
          <StyledColHead />
          <StyledColHead>Получаете</StyledColHead>
          <StyledColHead />
          <StyledColHead />
        </StyledTableHeader>
        <StyledTableBody>
          {collection &&
            collection.map(({ ...props }, index) => (
              <TopExchangeList key={index} {...props} />
            ))}
        </StyledTableBody>
      </StyledTable>
    </StyledTopExchangeWrapper>
  );
};

export default TopExchangeContainer;
