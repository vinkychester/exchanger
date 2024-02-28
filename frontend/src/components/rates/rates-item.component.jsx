import React, { useContext } from "react";
import Tooltip from "rc-tooltip";

import { StyledCol, StyledRow } from "../styles/styled-table";
import { StyledButton } from "../styles/styled-button";

import { RatesContext } from "./rates.component";

const RateItem = ({ rate, handler }) => {
  const {
    dayChange,
    currency,
    paymentSystem,
    paymentExchange,
    payoutExchange,
    paymentRate,
    payoutRate,
    paymentConstant,
    payoutConstant,
    paymentPrice,
    payoutPrice,
      paymentSurcharge,
      payoutSurcharge
  } = rate;
  const { asset } = currency;
  const { name, tag: paymentSystemTag } = paymentSystem;
  const { selected } = useContext(RatesContext);

  return (
    <StyledRow col="5" className="rates-table__row">
      <StyledCol data-title="Название" className="rates-table__name">
        <span
          className={`exchange-icon-${paymentSystemTag === "CRYPTO" ? asset : paymentSystemTag}`}
        />
        {name}
      </StyledCol>
      <StyledCol data-title="Аббревиатура" className="rates-table__tag">
        {asset}
      </StyledCol>
      <StyledCol data-title="24H изменение" className="rates-table__change">
        <span className={rate.dayChange > 0 ? "rates-table_green" : rate.dayChange < 0 ? 'rates-table_red' : "transparent"}>
          {dayChange ? dayChange > 0 ? "+" + dayChange : dayChange : 0}%
        </span>
      </StyledCol>
      <StyledCol data-title="Покупка" className="rates-table__selling">
        {payoutExchange ? (
          <Tooltip
            placement="top"
            overlay={
              <span>
                Покупка 1 {asset} <br />
                Комиссия: {payoutConstant} {asset} <br />
                Себестоимость:{" "}
                <span className={payoutSurcharge > 0 ? "green" : payoutSurcharge < 0 ? "red" : "transparent"}>
                  {payoutSurcharge.toFixed(2)}%
                </span>
              </span>
            }
          >
            <button
              onClick={() => handler(rate, "payment")}
              className="rates-table__link"
            >
              <div className="course-container">
                <div className="course-container__amount">{payoutRate}</div>
                <div className="course-container__currency">{selected.currency.asset}</div>
                <div className="course-container__price">
                  <span className={payoutSurcharge > 0 ? "green" : payoutSurcharge < 0 ? "red" : "transparent"}>
                    {payoutSurcharge.toFixed(2)}%
                  </span>
                </div>
              </div>
            </button>
          </Tooltip>
        ) : (
          <div className="not-available">Обмен недоступен</div>
        )}
      </StyledCol>
      <StyledCol data-title="Продажа" className="rates-table__purchase">
        {paymentExchange ? (
          <Tooltip
            placement="top"
            overlay={
              <span>
                Продажа 1 {asset} <br />
                Комиссия: {paymentConstant} {asset} <br />
                Себестоимость:{" "}
                <span className={paymentSurcharge > 0 ? "green" : paymentSurcharge < 0 ? "red" : "transparent"}
                >
                  {paymentSurcharge.toFixed(2)}%
                </span>
              </span>
            }
          >
            <button
              onClick={() => handler(rate, "payout")}
              className="rates-table__link"
            >
              <div className="course-container">
                <div className="course-container__amount">{paymentRate}</div>
                <div className="course-container__currency">{selected.currency.asset}</div>
                <div className="course-container__price">
                  <span className={paymentSurcharge > 0 ? "green" : paymentSurcharge < 0 ? "red" : "transparent"}>
                    {paymentSurcharge.toFixed(2)}%
                  </span>
                </div>
              </div>
            </button>
          </Tooltip>
        ) : (
          <div className="not-available">Обмен недоступен</div>
        )}
      </StyledCol>
      <StyledCol data-title="Действие" className="rates-table__mobile-button">
        <StyledButton onClick={() => handler(rate, "payment")} color="success">
          Купить
        </StyledButton>
        <StyledButton onClick={() => handler(rate, "payout")} color="danger">
          Продать
        </StyledButton>
      </StyledCol>
    </StyledRow>
  );
};

export default RateItem;
