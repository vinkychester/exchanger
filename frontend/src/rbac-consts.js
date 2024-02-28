const requisition = {
  READ: "requisitions:list",
  READ_DETAILS: "requisitions:details",
  CREATE: "requisitions:create",
  CANCEL: "requisitions:cancel",
  PAYMENT: "requisitions:payment",
  DETAILS: "requisitions:details",
  CLIENT_DETAILS: "requisitions:client-details",
  CANCEL_TEXT_DETAILS: "requisitions:cancel-text-details",
  ADMINISTRATION_DETAILS: "requisitions:administration-details",
  MANAGER_DETAILS: "requisitions:manager-details",
  REFERRAL_PROFIT: "requisitions:loyalty-program-profit",
  SYSTEM_PROFIT: "requisitions:system-profit",
  ACTIONS: "requisitions:actions",
  ASSIGN_EXCHANGE_POINT: "requisition.assign-exchange-point",
  ASSIGN_MESSAGE: "requisition:mc-cash-message",
  ASSIGN_CASH_ATTRIBUTES: "requisition:mc-cash-attributes",
  COMMENT_CREATE: "requisition:comment-create",
  USER_INFO: "requisition:user-info",
  MANAGER_PROFIT: "requisition:manager-profit",
  SET_MANAGER: "requisition:set-manager",
  DATE_INFO: "requisition:date-info",
  NOTIFICATION: "requisition:notification"
};

const payoutRequisitions = {
  READ: "referral-requisition:list",
  DETAILS: "referral-requisition:details",
  NOTIFICATION: "referral-requisition:notification"
};

const currency = {
  READ: "currencies:list",
};

const paymentSettings = {
  READ: "paymentSettings:list",
  CREATE_PAIR: "paymentSettings:create-pair",
};

const calculator = {
  EXCHANGE: "calculator:exchange",
  SET_REQUISITES: "calculator:set-requisites",
};

const admins = {
  READ: "admins:list",
};

const managers = {
  READ: "managers:list",
  EDIT: "manager:edit",
  BAN_ACTIONS: "manager:ban-actions",
};

const clients = {
  READ: "clients:list",
  READ_DETAILS: "clients-details:list",
  BAN_ACTIONS: "client:ban-actions",
};

const posts = {
  PANEL_READ: "posts:list",
  WRITE: "posts:write",
  EDIT_DATE: "posts:editDate",
};

const cityDetails = {
  PANEL_READ: "city-list",
  READ: "city-details:read",
  CREATE: "city-details:create",
  EDIT: "city-details:update",
};

const traffic = {
  PANEL_READ: "traffic:list",
  CREATE: "traffic:create",
  EDIT: "traffic:update",
  DELETE: "traffic:delete",
  CLIENT_DETAILS: "traffic:client-details",
  REQUISITION_DETAILS: "traffic:client-details",
};

const reviews = {
  PANEL_READ: "review:list",
  EDIT: "review:edit",
  CREATE: "review:create",
};

const seos = {
  READ: "seos:list",
};

const mailing = {
  READ: "mailing:send",
  DETAILS: "mailing:details",
};

const account = {
  READ: "account:read",
};

const loyalty = {
  READ: "loyalty-panel:read",
  CLIENT_READ: "loyalty-client-panel:read",
};

const sidebar = {
  REQUISITIONS: "requisitions:sidebar",
  CURRENCIES: "currencies:sidebar",
  PAYMENT_SETTINGS: "payment-settings:sidebar",
  LOYALTY_PROGRAM: "loyalty-program:sidebar",
  LOYALTY_PROGRAM_ADMIN: "loyalty-program-admin:sidebar",
  LOYALTY_PROGRAM_CLIENT: "loyalty-program-client:sidebar",
  CASHBACK: "cashback:sidebar",
  REFERRAL: "referral-program:sidebar",
  REPORTS: "reports:sidebar",
  CLIENTS: "clients:sidebar",
  CITIES_CONTACTS: "cities-contacts:sidebar",
  CITIES_DETAILS: "cities-details:sidebar",
  NEWS: "news:sidebar",
  TRAFFIC: "traffic:sidebar",
  FEEDBACKS: "feedbacks:sidebar",
  REVIEWS: "reviews:sidebar",
  MAILING: "mailing:sidebar",
  LOGS: "logs:sidebar",
  MANUAL: "manual:sidebar",
  DOCUMENTS: "documents:sidebar",
  ADMINISTRATION: "administration:sidebar",
  ADMINS: "admins:sidebar",
  MANAGERS: "managers:sidebar",
  SEOS: "seos:sidebar",
  BANK_DETAILS: "bank-details:sidebar",
  CARD_VERIFICATION: "card-verification:sidebar",
};

const rolePage = {
  ADMINISTRATION: "administration:role-page",
  ADMINS: "admins:role-page",
  MANAGERS: "managers:role-page",
  SEOS: "seos:role-page",
};

const logs = {
  PANEL_READ: "logs:list",
};

const documents = {
  PANEL_READ: "documents:read",
  PANEL_VERIFICATION: "document:verification",
};

const reports = {
  PANEL_READ: "reports:list",
  REQUISITIONS: "reports:requisition-tab",
  LOYALTY: "reports:loyalty-tab",
  TRAFFIC: "reports:traffic-tab",
  MANAGERS: "reports:managers-tab",
};

const feedbacks = {
  PANEL_READ: "feedbacks:list",
  DETAILS: "feedback:details",
};

const cardVerification = {
  CREATE: "card-verification:create",
  READ: "card-verification:list",
  READ_DETAILS: "card-verification:details",
  CLIENT_DETAILS: "card-verification:client-details",
  ACTIONS: "card-verification:actions",
  DELETE: "card-verification:delete",
  FILTER_CLIENT_DETAILS: "card-verification:filter-client-details",
  NOTIFICATION: "card-verification:notification"
};

const bankDetails = {
  ACTIONS: "bank-details:actions",
};

export {
  requisition,
  currency,
  paymentSettings,
  calculator,
  sidebar,
  rolePage,
  managers,
  admins,
  seos,
  posts,
  reviews,
  logs,
  account,
  documents,
  reports,
  clients,
  payoutRequisitions,
  feedbacks,
  traffic,
  cityDetails,
  cardVerification,
  mailing,
  loyalty,
  bankDetails,
};
