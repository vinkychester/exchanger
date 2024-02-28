import React, { useContext, useState } from "react";
import { useQuery } from "@apollo/react-hooks";
import { NavLink } from "react-router-dom";

import AlertMessage from "../../alert/alert.component";
import { TrafficFilterContext } from "./traffic-reports-container.component";
import { GET_CLIENTS_TRAFFIC } from "../../../graphql/queries/clients.query";
import {
  convertDateToTimestampEnd,
  convertDateToTimestampStart,
} from "../../../utils/datetime.util";
import { convertToUSD } from "../../../utils/convertToUSD.utils";
import SkeletonTraffic from "../skeleton/skeleton-traffic";

import { StyledCol } from "../../styles/styled-table";

import { parseUuidIRI } from "../../../utils/response";

const TrafficReportsRegisteredClients = ({
  trafficLink,
  clientsTotalCount,
  setClientsTotalCount,
}) => {
  const { filter } = useContext(TrafficFilterContext);
  const [requisitionsTotalCount, setRequisitionsTotalCount] = useState(0);
  const [requisitionsProfit, setRequisitionsProfit] = useState(0);

  const [requisitionsSystemProfit, setRequisitionsSystemProfit] = useState(0);
  const { token, id } = trafficLink;

  const { tdate_gte, tdate_lte } = filter;
  const { data, loading, error } = useQuery(GET_CLIENTS_TRAFFIC, {
    variables: {
      trafficToken: token,
      tdate_gte: convertDateToTimestampStart(tdate_gte),
      tdate_lte: convertDateToTimestampEnd(tdate_lte),
    },
    onCompleted: (data) => {
      const { paginationInfo, collection } = data.clients;
      setClientsTotalCount(paginationInfo.totalCount);
      collection.map((client) => {
        const { collection, paginationInfo } = client.requisitions;
        setRequisitionsTotalCount(
          (prevState) => prevState + paginationInfo.totalCount
        );
        collection.map((requisition) => {
          const { profit, systemProfit, pair, requisitionFeeHistories } =
            requisition;
          const { payment } = pair;
          const { currency } = payment;
          const { tag } = currency;
          const { rate } = requisitionFeeHistories.find(
            (fee) => fee.type === "payment"
          );
          setRequisitionsProfit(
            (prevState) => prevState + convertToUSD(tag, profit, rate)
          );
          setRequisitionsSystemProfit(
            (prevState) => prevState + convertToUSD(tag, systemProfit, rate)
          );
        });
      });
    },
  });
  if (loading) return <SkeletonTraffic />;
  if (error)
    return (
      <AlertMessage type="error" message={error.message} margin="15px 0" />
    );
  if (!data)
    return (
      <AlertMessage
        type="info"
        message="Нет клиентов по данной трафиковой ссылке"
        margin="15px 0 0"
      />
    );

  return (
    <>
      <StyledCol
        data-title="Кол-во зарегистрированных"
        className="traffic-list-table__count-register"
      >
        <NavLink
          className="default-link"
          to={`/panel/reports/traffic-details-clients/${parseUuidIRI(id)}`}
        >
          {clientsTotalCount}
        </NavLink>
      </StyledCol>
      <StyledCol
        data-title="Кол-во заявок"
        className="traffic-list-table__count-requisitions"
      >
        <NavLink
          className="default-link"
          to={`/panel/reports/traffic-details-requisitions/${parseUuidIRI(id)}`}
        >
          {requisitionsTotalCount}
        </NavLink>
      </StyledCol>
      <StyledCol
        data-title="Прибыль системы"
        className="traffic-list-table__system-profit"
      >
        {requisitionsProfit.toFixed(2)} USD
      </StyledCol>
      <StyledCol
        data-title="Чистая прибыль системы"
        className="traffic-list-table__clean-profit"
      >
        {requisitionsSystemProfit.toFixed(2)} USD
      </StyledCol>
    </>
  );
};

export default TrafficReportsRegisteredClients;
