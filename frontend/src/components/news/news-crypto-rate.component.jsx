import React from "react";

const NewsCryptoRate = ({ payment, pairUnit, handleRedirectOnCalculator }) => {
  return (
    <div className="dynamic-rates__item exchange-item">
      <div className="exchange-item__name">
        <span className={`exchange-icon-${payment.payout.paymentSystem.tag}`} />
        <span>{payment.payout.paymentSystem.name} {payment.payout.currency.asset}</span>
      </div>
      <div className="exchange-item__course" onClick={() => handleRedirectOnCalculator( pairUnit, payment.payout, "payout")}>{payment.payoutRatePost}</div>
      <div className="exchange-item__course" onClick={() => handleRedirectOnCalculator( pairUnit, payment.payout, "payment")}>{payment.paymentRatePost}</div>
    </div>
  );
};

export default NewsCryptoRate;