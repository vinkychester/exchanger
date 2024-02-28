import React from "react";
import { useQuery } from "@apollo/react-hooks";
import AlertMessage from "../alert/alert.component";

import { GET_CITY_BY_EXTERNAL_ID } from "../../graphql/queries/cities.query"

const RequisitionCity = ({ exchangePoint }) => {
  const { data, loading, error } = useQuery(GET_CITY_BY_EXTERNAL_ID, {
    variables: { externalId: parseInt(exchangePoint) },
    fetchPolicy: "network-only"
  });

  if (loading) return "Загрузка...";
  if (error) return <AlertMessage type="info" message="Error" />;

  const { cities } = data;

  if (!cities.length) return <AlertMessage type="info" message="Нет города" />;

  return (
    <>{cities[0].name}</>
  )
};

export default RequisitionCity;