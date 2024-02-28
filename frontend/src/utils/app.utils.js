const CapitalizedText = (str) => {
  if (typeof str !== "string") return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const hideCreditCardSigns = (cardNumber) => {
  let cardNumberFirst = cardNumber.slice(0, 6);
  let cardNumberLast = cardNumber.substr(cardNumber.length - 4);
  return cardNumberFirst + "******" + cardNumberLast;
};

export { CapitalizedText, hideCreditCardSigns };
