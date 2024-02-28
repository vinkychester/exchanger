import React from "react";
import { useQuery } from "@apollo/react-hooks";

import AlertMessage from "../alert/alert.component";

import { GET_CLIENT_FULLNAME } from "../../graphql/queries/clients.query";
import CalculatorSkeletonUser from "./skeleton/calculator-skeleton-user";

const CalculatorUserTab = ({ id }) => {
  const { data, loading, error } = useQuery(GET_CLIENT_FULLNAME, {
    variables: { id },
  });

  if (loading) return <CalculatorSkeletonUser/>;
  if (error) return <AlertMessage type="error" message="Error!" margin="0 3px 0 0" />;
  if (!data) return <AlertMessage type="warning" message="Not found." margin="0 3px 0 0" />;

  const { firstname, lastname } = data.client;

  return (
    <AlertMessage
      type="info"
      message={`Создание заявки для ${firstname} ${lastname}`}
      margin="15px 0"
    />
  );
};

export default React.memo(CalculatorUserTab);
