import React, { useState, createContext } from "react";
import { NavLink } from "react-router-dom";

import RatesPayment from "./rates-payment.component";
import RatesList from "./rates-list.component";
import RatesReserve from "./rates-reserve.component";

import { StyledRatesHeader, StyledRatesInfo } from "../../pages/rates/styled-rates";
import { StyledList } from "../styles/styled-document-elemets";

export const RatesContext = createContext({});

const Rates = () => {
  const [selected, setSelected] = useState({});

  return (
    <RatesContext.Provider
        value={{ selected, setSelected }}
    >
      <StyledRatesHeader>
        <RatesPayment />
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
      </StyledRatesHeader>
      <RatesReserve />
      {Object.keys(selected).length !== 0 && <RatesList />}
    </RatesContext.Provider>
  );
};

export default Rates;
