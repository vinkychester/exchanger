const { default: PaycoreLink } = require("./flow-paycore-link.component");
const { default: Address } = require("./flow-address.component");
const { default: BlockchainUrl } = require("./flow-blockchainUrl.component");
const { default: TxHash } = require("./flow-tx-hash.component");
const { default: Confirms } = require("./flow-confirms.component");
const { default: Amount } = require("./flow-amount.component");
const { default: Code } = require("./flow-code.component");
const { default: CardMask } = require("./flow-cardMask.component");

const flowComponentMapping = {
  link: PaycoreLink,
  address: Address,
  blockchainUrl: BlockchainUrl,
  confirms: Confirms,
  amount: Amount,
  code: Code,
  "tx-hash": TxHash,
  // expectedConfirms: ExpectedConfirms
  cardMask: CardMask,
  //default: Default
};

export { flowComponentMapping };
