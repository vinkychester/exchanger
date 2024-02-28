import React, { useContext } from "react";
import { NavLink } from "react-router-dom";

import {
  StyledAvailableReserve, StyledCardLimit, StyledLimits,
  StyledMinMax,
  StyledMinMaxTitle,
  StyledReserveWrapper
} from "./styled-reserve";
import { StyledSkeletonBg } from "../styles/styled-skeleton-bg";

import { RatesContext } from "./rates.component";

const RatesReserve = () => {
  const { selected } = useContext(RatesContext);
  return (
    <StyledReserveWrapper>
      <StyledAvailableReserve className="bank">
        <div className="rate-icon__bank" />
        <div className="bank-reserve">
          <h5 className="bank-reserve__title">Доступный резерв:</h5>
          <p className="bank-reserve__amount">
            {Object.keys(selected).length !== 0
              ? selected?.balance?.toFixed(2)
              : "пересчет..."}
          </p>
          <p className="bank-reserve__help">
            Недостаточно резерва?{" "}
            <NavLink to="/contacts">Свяжитесь с нами</NavLink>
          </p>
        </div>
      </StyledAvailableReserve>
      <StyledLimits>
        <StyledMinMaxTitle className="min-max">
          <p>
            <span className="rate-icon__min" />
            Минимум:
          </p>
          <p>
            <span className="rate-icon__max" />
            Максимум:
          </p>
        </StyledMinMaxTitle>
        <StyledMinMax className="selling" data-title="Покупка">
          <p data-title="Минимум">
            {Object.keys(selected).length === 0 ? (
              <StyledSkeletonBg as="span" height="19" width="35" />
            ) : (
              <>
                {selected.minPayment} {selected.currency.asset}
              </>
            )}
          </p>
          <p data-title="Максимум">
            {Object.keys(selected).length === 0 ? (
              <StyledSkeletonBg as="span" height="19" width="55" />
            ) : (
              <>
                {selected.maxPayment} {selected.currency.asset}
              </>
            )}
          </p>
        </StyledMinMax>
        <StyledMinMax className="purchase" data-title="Продажа">
          <p data-title="Минимум">
            {Object.keys(selected).length === 0 ? (
              <StyledSkeletonBg as="span" height="19" width="35" />
            ) : (
              <>
                {selected.minPayout} {selected.currency.asset}
              </>
            )}
          </p>
          <p data-title="Максимум">
            {Object.keys(selected).length === 0 ? (
              <StyledSkeletonBg as="span" height="19" width="55" />
            ) : (
              <>
                {selected.maxPayout} {selected.currency.asset}
              </>
            )}
          </p>
        </StyledMinMax>
        <StyledCardLimit className="card-limit">
        {Object.keys(selected).length !== 0 && selected.paymentSystem.name !== "Cash" ?
            "До 10 транзакций на одну карту в сутки." : ""
        }
        </StyledCardLimit>
      </StyledLimits>
    </StyledReserveWrapper>
  );
};

export default RatesReserve;
