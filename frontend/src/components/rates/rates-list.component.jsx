import React, { useContext, useCallback, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useQuery } from "@apollo/react-hooks";

import AlertMessage from "../alert/alert.component";
import RatesListSkeleton from "./skeleton/rates-list-skeleton";
import RateItem from "./rates-item.component";

import { StyledRatesBody } from "../../pages/rates/styled-rates";
import {
  StyledColHead,
  StyledTable,
  StyledTableBody,
  StyledTableHeader,
} from "../styles/styled-table";

import { GET_CRYPTO_RATES_PAIR_UNIT } from "../../graphql/queries/pair-unit.query";
import { RatesContext } from "./rates.component";
import { mercureUrl } from "../../utils/response";
import { generateUrl, getInverseDirection } from "../../utils/calculator.utils";
import { deleteDuplicates } from "../../utils/rates.util";

const RatesList = () => {
  let history = useHistory();
  const { selected } = useContext(RatesContext);

    const { data, loading, error, refetch } = useQuery(GET_CRYPTO_RATES_PAIR_UNIT, {
      variables: {
        paymentSystemName: selected?.paymentSystem?.name,
        currencyName: selected?.currency?.asset
      },
      fetchPolicy: "network-only"
    });

  mercureUrl.searchParams.append("topic", `http://coin24/rates`);

  useEffect(() => {
    const eventSource = new EventSource(mercureUrl);
    eventSource.onmessage = (event) => {
      refetch({
        variables: {
          paymentSystemName: selected?.paymentSystem?.name,
          currencyName: selected?.currency?.asset
        },
      })
    };

    return () => {
      eventSource.close();
    };
  }, [refetch, selected?.currency?.asset, selected?.paymentSystem?.name]);

  const handleRedirectToCalculator = useCallback((crypto, direction) => {
    const cryptoUrl = generateUrl(crypto, getInverseDirection(direction));
    const fiatUrl = generateUrl(selected, direction);
    const url = "payment" === direction ? `${fiatUrl}-${cryptoUrl}` : `${cryptoUrl}-${fiatUrl}`;

    history.push({
      pathname: "/" + url,
      state: {
        amount: 1,
        direction: getInverseDirection(direction),
        cryptoCurrency: ("payment" === direction ? "payout" : "payment") + crypto.paymentSystem.name + crypto.currency.asset.replace(/\s+/g, ""),
        fiatCurrency: ("payment" === direction ? "payment" : "payout") + selected.paymentSystem.name + selected.currency.asset.replace(/\s+/g, "")
      }
    });
  }, [selected]);

  if (loading) return <RatesListSkeleton />;
  if (error) return <AlertMessage type="error" message="Error" />;
  if (!data) return <AlertMessage type="warning" message="Not found." />;

  const { collection } = data.cryptoCollectionPairUnits;

  if (!collection.length)
    return <AlertMessage type="warning" message="Нет платежных систем." />;

  const filtered = deleteDuplicates(collection);
  
  return (
    <StyledRatesBody>
      <StyledTable className="rates-table">
        <StyledTableHeader col="5" className="rates-table__header">
          <StyledColHead>Название</StyledColHead>
          <StyledColHead>Аббревиатура</StyledColHead>
          <StyledColHead>24H изменение</StyledColHead>
          <StyledColHead>Покупка</StyledColHead>
          <StyledColHead>Продажа</StyledColHead>
        </StyledTableHeader>
        <StyledTableBody>
        {filtered && filtered.map((rate, index) => (
          <RateItem key={index} rate={rate} handler={handleRedirectToCalculator} />
        ))}
        </StyledTableBody>
      </StyledTable>
    </StyledRatesBody>
  );
};

export default RatesList;
