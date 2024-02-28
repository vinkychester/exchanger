import MCCashAddress from "./mc-cash-address.component";
import MCCashDescription from "./mc-cash-description.component";
import MCCashExchangePoint from "./mc-cash-exchange-point.component";
import MCCashName from "./mc-cash-name.component";

const mcCashComponentMapping = {
  address: MCCashAddress,
  name: MCCashName,
  description: MCCashDescription,
  exchangePointId: MCCashExchangePoint
};

export { mcCashComponentMapping };