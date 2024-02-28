const getID = (pairIRI) => {
  const regex = /\d+/i;
  return +pairIRI.match(regex)[0];
};

const getUUID = (pairIRI) => {
  const regex = /[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}/i;
  return regex.exec(pairIRI)[0];
};

const getInverseDirection = (direction) => {
  return direction === "payment" ? "payout" : "payment";
};

const generateUrl = (node, direction) => {
  if (null === node) return;

  const { currency, paymentSystem, service } = node;

  let url = "";
  let asset = currency.asset.split(/\(/).join('').split(/\)/).join('').replace(/\s/g, "");
  // let asset = currency.asset.split(/\(/).join('').split(/\)/).join('').replace(/\s/g, "&");

  direction === "payment"
    ? (url = `${service.tag}-${asset}-${currency.tag === "CRYPTO" ? paymentSystem.subName : paymentSystem.tag}`)
    : (url = `to-${service.tag}-${asset}-${currency.tag === "CRYPTO" ? paymentSystem.subName : paymentSystem.tag}`);

  return url.toLocaleLowerCase();
};

const findPairUnitsByTab = (collection, tab) => {
  if ("all" === tab) return collection;
  return collection.filter(item => item.pairUnitTabs.name === tab);
};

const findPair = (payment, payout) => {
  const { collection: paymentCollection } = payment.paymentPairs;
  const { collection: payoutCollection } = payout.payoutPairs;

  for (let i = 0; i < paymentCollection.length; i++) {
    for (let k = 0; k < payoutCollection.length; k++) {
      if (paymentCollection[i].id === payoutCollection[k].id) {
        return paymentCollection[i].id;
      }
    }
  }

  return null;
};

const isActive = (exchangeValue, node) => {
  if (null === exchangeValue || null === node) return false;

  const { collection: exchangeValueCollection } = exchangeValue[`${exchangeValue.direction}Pairs`];
  const { collection: nodeCollection } = node[`${node.direction}Pairs`];

  if (!exchangeValueCollection.length || !nodeCollection.length) return false;

  for (let i = 0; i < exchangeValueCollection.length; i++) {
    for (let k = 0; k < nodeCollection.length; k++) {
      if (exchangeValueCollection[i].id === nodeCollection[k].id) {
        return true;
      }
    }
  }

  return false;
};

export {
  getID,
  getInverseDirection,
  generateUrl,
  findPair,
  isActive,
  findPairUnitsByTab,
  getUUID
};
