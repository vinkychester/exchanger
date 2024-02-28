import React, { useState } from "react";
import { useQuery } from "@apollo/react-hooks";
import { NavLink } from "react-router-dom";
import AlertMessage from "../../../components/alert/alert.component";
import RatesReserve from "../../../components/rates/rates-reserve.component";
import RatesList from "../../../components/rates/rates-list.component";
import Title from "../../../components/title/title.component";
import Spinner from "../../../components/spinner/spinner.component";

import { StyledExchangeDirectionsRates } from "../styled-exchange-directions";
import { StyledRatesInfo } from "../../rates/styled-rates";
import { StyledList } from "../../../components/styles/styled-document-elemets";

import { GET_PAIR_UNIT_BY_CURRENCY } from "../../../graphql/queries/pair-unit.query";
import { RatesContext } from "../../../components/rates/rates.component";


const DirectionsRates = ({paymentSystem, currency}) => {
  const [selected, setSelected] = useState({});

  const { data, loading, error } = useQuery(GET_PAIR_UNIT_BY_CURRENCY, {
    variables: {
      paymentSystemName: paymentSystem,
      currencyName: currency
    },
    fetchPolicy: "network-only",
    onCompleted: ({ currencyPairUnits }) => {
      if (currencyPairUnits.collection.length !== 0) {
        setSelected(currencyPairUnits.collection[0]);
      }
    }
  });

  if (loading || Object.keys(selected).length === 0) return <Spinner color="#EC6110" type="moonLoader" size="40px" />;
  if (error) return <AlertMessage type="error" message="Error" />;
  if (!data) return <AlertMessage type="warning" message="Not found." />;

  return (
    <StyledExchangeDirectionsRates>
      <Title as="div" title={`Курс криптовалют на ${paymentSystem} ${currency}`} description="Обмен" className="direction-title" />
      <StyledRatesInfo>
        <StyledList>
          <li>
            Детальнее с сетевыми комиссиями и лимитами ознакомиться <NavLink to="/tariff" className="default-link">можно здесь</NavLink>.
          </li>
          <li>
            Курсы на данной странице, могут не совпадать с реальными курсами на момент отправки заявки.
          </li>
          <li>
            За каждую транзакцию есть комиссия эквивалентна криптомонетам. Некоторые банки могут брать доп.
            комиссию. Так же учитывается себестоимость, если +% - наша доплата (зеленый цвет), -%  - ваша доплата (красный цвет).
          </li>
        </StyledList>
      </StyledRatesInfo>
      <RatesContext.Provider
        value={{ selected, setSelected }}
      >
        <RatesReserve />
        {Object.keys(selected).length !== 0 && <RatesList />}
      </RatesContext.Provider>
    </StyledExchangeDirectionsRates>
  );
};

export default React.memo(DirectionsRates);