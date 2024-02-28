import React from "react";
import { useQuery } from "@apollo/react-hooks";
import { GET_CLIENT_CASHBACK_LEVELS_BY_USER_ID } from "../../../graphql/queries/cashback-client-level.query";
import { GET_CASHBACK_LEVELS } from "../../../graphql/queries/cashback-level.query";
import { getUUID } from "../../../utils/calculator.utils";
import CashbackClientLevelItem from "./client-cashback-level-item.component";
import ClientCashbackLevelForm from "./client-cashback-level-form.component";
import AlertMessage from "../../alert/alert.component";
import Spinner from "../../spinner/spinner.component";

const ClientDetailsCashbackLevels = ({ id }) => {
  const clientId = getUUID(id);

  const {
    data: dataCashbackLevels,
    loading: loadingCashbackLevels,
    error: errorCashbackLevels
  } = useQuery(GET_CASHBACK_LEVELS);

  const {
    data: dataCashbackClientLevels,
    loading: loadingCashbackClientLevels,
    error: errorCashbackClientLevels,
    refetch
  } = useQuery(GET_CLIENT_CASHBACK_LEVELS_BY_USER_ID, {
    fetchPolicy: "network-only",
    variables: {
      clientId: clientId
    }
  });

  if (loadingCashbackLevels || loadingCashbackClientLevels) return <Spinner
    color="#EC6110"
    type="moonLoader"
    size="20px"
  />;
  if (errorCashbackLevels) return <AlertMessage type="error" message={errorCashbackLevels.message} />;
  if (errorCashbackClientLevels) return <AlertMessage type="error" message={errorCashbackClientLevels.message} />;
  if (!dataCashbackClientLevels || !dataCashbackLevels) return <AlertMessage
    type="warning"
    message="Oops, Something Went Wrong. =("
  />;

  const { collection: collectionCashbackClientLevels } = dataCashbackClientLevels.cashbackClientLevels;
  const { collection: collectionCashbackLevels } = dataCashbackLevels.cashbackLevels;

  if (!collectionCashbackLevels.length) return <AlertMessage
    type="info"
    message="Кешбэк уровни не найдены."
    margin="0 0 15px"
  />;

  if (!collectionCashbackClientLevels.length) return <AlertMessage
    type="info"
    message="Кешбэк уровни клиента не найдены."
    margin="0 0 15px"
  />;

  return (
    <>
      <ClientCashbackLevelForm
        clientUUID={clientId}
        cashbackLevels={collectionCashbackLevels}
        refetch={refetch}
      />

      {collectionCashbackClientLevels.map((cashbackClientLevel, key) => (
        <CashbackClientLevelItem
          key={key}
          cashbackClientLevel={cashbackClientLevel}
          cashbackLevels={collectionCashbackLevels}
          refetch={refetch}
        />
      ))}
    </>
  );

};

export default ClientDetailsCashbackLevels;