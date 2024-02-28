import { requisitionStatusConst } from "./requsition.status";
import { convertToUSD } from "./convertToUSD.utils";

const findInvoice = (invoices, direction) => {
  return invoices.find((invoice) => invoice.direction === direction);
};

const getPaidRequisitions = (collection) => {
  return collection.filter(
    (item) =>
      item.status !== requisitionStatusConst.NEW &&
      item.status !== requisitionStatusConst.FINISHED &&
      item.status !== requisitionStatusConst.ERROR &&
      item.status !== requisitionStatusConst.CANCELED
  );
};

const getTotalSystemProfit = (collection) => {
  let totalSystemProfit = 0;
  collection.map((requisition) => {
    const { systemProfit, pair, requisitionFeeHistories } = requisition;
    const { payment } = pair;
    const { currency } = payment;
    const { tag } = currency;
    const { rate } = requisitionFeeHistories.find(fee => fee.type === "payment");
    totalSystemProfit += convertToUSD(tag, systemProfit, rate);
  });
  return totalSystemProfit;
};

const getManagersTotalProfit = (collection) => {
  let managerTotalProfit = 0;
  collection.map(({managerProfit}) => {
    managerProfit && managerProfit.map(({value}) => managerTotalProfit += value);
  })
  
  return managerTotalProfit;
}

const getReferralsTotalProfit = (collection) => {
  let managerReferralTotalProfit = 0;
  collection.map(item => {
    item.referralProfit && item.referralProfit.map(item => managerReferralTotalProfit += item.value);
  })

  return managerReferralTotalProfit;
};

export {
  findInvoice,
  getPaidRequisitions,
  getManagersTotalProfit,
  getTotalSystemProfit,
  getReferralsTotalProfit
};
