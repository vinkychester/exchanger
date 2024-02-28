const CalculatorTooltips = (direction, name) => {

  let directionName = `${direction}-${name}`;

  switch (directionName) {
    case "payment-bank": {
      return "Оплатить банковской картой";
    }
    case "payment-cash": {
      return "Оплатить наличными";
    }
    case "payment-payments": {
      return "Оплатить переводом на платежную систему";
    }
    case "payment-coin": {
      return "Оплатить криптовалютой";
    }
    case "payout-bank": {
      return "Получить на банковскую карту";
    }
    case "payout-cash": {
      return "Получить наличные";
    }
    case "payout-payments": {
      return "Получить перевод на платежную систему";
    }
    case "payout-coin": {
      return "Получить криптовалюту";
    }
    default: {
      return "Весь список";
    }
  }
};

export { CalculatorTooltips };