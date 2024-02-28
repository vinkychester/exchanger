import React from "react";
import { useQuery } from "@apollo/react-hooks";

import Spinner from "../spinner/spinner.component";
import AlertMessage from "../alert/alert.component";

import { StyledBlockSubText } from "../styles/styled-info-block";

import { GET_USDT_COMMISSION } from "../../graphql/queries/currency.query";

const LoyaltyProgramCommission = () => {
  const { loading, error, data } = useQuery(GET_USDT_COMMISSION);

  if (loading) return <Spinner color="#EC6110" type="moonLoader" size="20px" />;
  if (error)
    return <AlertMessage type="error" message="Error" margin="15px 0" />;
  if (!data) return <AlertMessage type="warning" message="Not found." />;

  const { collection } = data.pairUnits;

  if (!collection.length)
    return <AlertMessage type="warning" message="Нет платежных систем." />;

  return (
    <>
      {collection &&
        collection.map(({ id, currency, fee }) => (
          <StyledBlockSubText key={id} className="referral-balance__commission">
            <p>Комиссия платежной системы {currency.asset}:</p>{" "}
            <span>{fee.constant} USDT</span>
          </StyledBlockSubText>
        ))}
    </>
  );
};

export default LoyaltyProgramCommission;
