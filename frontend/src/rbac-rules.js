import {
  currency,
  paymentSettings,
  requisition,
  sidebar,
  rolePage,
  managers,
  admins,
  seos,
  calculator,
  posts,
  reviews,
  logs,
  account,
  documents,
  clients,
  reports,
  payoutRequisitions,
  cityDetails,
  feedbacks,
  traffic,
  mailing,
  cardVerification,
  loyalty,
  bankDetails,
} from "./rbac-consts";

const isOwner = (userId, ownerId) => {
  if (!userId || !ownerId) return false;
  return userId === ownerId;
};

const rules = {
  anonymous: {
    static: ["home-page:visit", reviews.CREATE],
  },
  seo: {
    static: [
      sidebar.NEWS,
      sidebar.REPORTS,
      sidebar.TRAFFIC,
      sidebar.CITIES_DETAILS,
      posts.PANEL_READ,
      posts.WRITE,
      "users:getSelf",
      "home-page:visit",
      account.READ,
      reports.PANEL_READ,
      reports.TRAFFIC,
      traffic.PANEL_READ,
      traffic.CREATE,
      traffic.EDIT,
      traffic.DELETE,
      cityDetails.PANEL_READ,
      cityDetails.READ,
      cityDetails.CREATE,
      cityDetails.EDIT,
    ],
    dynamic: {
      "posts:edit": ({ userId, ownerID }) => {
        if (!userId || !ownerID) return false;
        return userId === ownerID;
      },
    },
  },
  admin: {
    static: [
      //sidebar
      sidebar.REQUISITIONS,
      sidebar.CURRENCIES,
      sidebar.PAYMENT_SETTINGS,
      sidebar.LOYALTY_PROGRAM,
      sidebar.LOYALTY_PROGRAM_ADMIN,
      sidebar.CASHBACK,
      sidebar.REPORTS,
      sidebar.CLIENTS,
      sidebar.NEWS,
      sidebar.FEEDBACKS,
      sidebar.REVIEWS,
      sidebar.LOGS,
      sidebar.MAILING,
      sidebar.MANUAL,
      sidebar.MANAGERS,
      sidebar.ADMINS,
      sidebar.CITIES_CONTACTS,
      sidebar.CITIES_DETAILS,
      sidebar.TRAFFIC,
      sidebar.CARD_VERIFICATION,
      // role page
      rolePage.ADMINS,
      rolePage.MANAGERS,
      rolePage.SEOS,
      "users:get",
      "users:getSelf",
      "home-page:visit",
      "dashboard-page:visit",
      // requisitions
      requisition.READ,
      requisition.READ_DETAILS,
      requisition.NOTIFICATION,
      // requisition.DETAILS,
      requisition.CLIENT_DETAILS,
      requisition.ADMINISTRATION_DETAILS,
      requisition.REFERRAL_PROFIT,
      requisition.SYSTEM_PROFIT,
      requisition.ASSIGN_CASH_ATTRIBUTES,
      requisition.USER_INFO,
      requisition.MANAGER_PROFIT,
      requisition.SET_MANAGER,
      requisition.DATE_INFO,
      // currencies
      currency.READ,
      // paymentSettings
      paymentSettings.READ,
      paymentSettings.CREATE_PAIR,
      // admins
      admins.READ,
      // managers
      managers.READ,
      managers.EDIT,
      managers.BAN_ACTIONS,
      // seos
      seos.READ,
      // posts
      posts.PANEL_READ,
      posts.WRITE,
      posts.EDIT_DATE,
      // reviews
      reviews.PANEL_READ,
      reviews.EDIT,
      logs.PANEL_READ,
      account.READ,
      //Client
      clients.READ,
      clients.BAN_ACTIONS,
      clients.READ_DETAILS,
      reports.PANEL_READ,
      reports.REQUISITIONS,
      reports.LOYALTY,
      reports.TRAFFIC,
      reports.MANAGERS,
      loyalty.READ,
      payoutRequisitions.READ,
      payoutRequisitions.DETAILS,
      payoutRequisitions.NOTIFICATION,
      //feedbacks
      feedbacks.PANEL_READ,
      feedbacks.DETAILS,
      traffic.PANEL_READ,
      traffic.CREATE,
      traffic.EDIT,
      traffic.DELETE,
      traffic.CLIENT_DETAILS,
      traffic.REQUISITION_DETAILS,
      //cityDetails
      cityDetails.PANEL_READ,
      cityDetails.READ,
      cityDetails.CREATE,
      cityDetails.EDIT,
      // card verification
      cardVerification.READ,
      cardVerification.READ_DETAILS,
      cardVerification.CLIENT_DETAILS,
      cardVerification.ACTIONS,
      cardVerification.FILTER_CLIENT_DETAILS,
      cardVerification.NOTIFICATION,
      mailing.READ,
      mailing.DETAILS,
    ],
  },
  manager: {
    static: [
      //sidebar
      sidebar.REQUISITIONS,
      sidebar.CLIENTS,
      sidebar.FEEDBACKS,
      sidebar.REVIEWS,
      sidebar.MANUAL,
      sidebar.CARD_VERIFICATION,
      sidebar.REPORTS,
      reports.MANAGERS,
      // requisitions
      requisition.READ,
      requisition.NOTIFICATION,
      // requisition.DETAILS,
      requisition.CLIENT_DETAILS,
      requisition.REFERRAL_PROFIT,
      requisition.USER_INFO,
      requisition.MANAGER_PROFIT,
      // requisition.ASSIGN_CASH_ATTRIBUTES,
      requisition.ASSIGN_EXCHANGE_POINT,
      requisition.DATE_INFO,
      // posts
      posts.PANEL_READ,
      posts.WRITE,
      // reviews
      reviews.PANEL_READ,
      reviews.EDIT,
      account.READ,
      clients.READ_DETAILS,
      clients.READ,
      loyalty.READ,
      payoutRequisitions.READ,
      payoutRequisitions.DETAILS,
      payoutRequisitions.NOTIFICATION,
      //feedbacks
      feedbacks.PANEL_READ,
      feedbacks.DETAILS,
      // card verification
      // cardVerification.READ,
      cardVerification.READ_DETAILS,
      cardVerification.CLIENT_DETAILS,
      cardVerification.ACTIONS,
      cardVerification.FILTER_CLIENT_DETAILS,
      cardVerification.NOTIFICATION,
    ],
    dynamic: {
      [requisition.ASSIGN_CASH_ATTRIBUTES]: ({ userId, ownerId }) => {
        return isOwner(userId, ownerId);
      },
      [requisition.READ_DETAILS]: ({ exchangePoint, managerCity }) => {
        if (!exchangePoint || !managerCity) return false;
        return managerCity.includes(exchangePoint);
      },
      [cardVerification.READ]: ({ isBank }) => {
        if (!isBank) return false;
        return true;
      },
      [calculator.EXCHANGE]: (managerClientRequisition) => {
        return managerClientRequisition;
      },
      [calculator.SET_REQUISITES]: (managerClientRequisition) => {
        return managerClientRequisition;
      },
    },
  },
  client: {
    static: [
      //sidebar
      sidebar.REQUISITIONS,
      sidebar.LOYALTY_PROGRAM,
      sidebar.LOYALTY_PROGRAM_CLIENT,
      sidebar.DOCUMENTS,
      sidebar.MANUAL,
      sidebar.BANK_DETAILS,
      sidebar.CARD_VERIFICATION,
      loyalty.CLIENT_READ,
      // requisitions
      requisition.READ,
      requisition.CREATE,
      requisition.ASSIGN_MESSAGE,
      requisition.COMMENT_CREATE,
      // requisition.DETAILS,
      // calculator
      calculator.EXCHANGE,
      calculator.SET_REQUISITES,
      account.READ,
      // documents
      documents.PANEL_READ,
      documents.PANEL_VERIFICATION,
      // card verification
      cardVerification.CREATE,
      cardVerification.READ,
      cardVerification.DELETE,
      // bank details
      bankDetails.ACTIONS,
      reviews.CREATE
    ],
    dynamic: {
      [requisition.READ_DETAILS]: ({ userId, ownerId }) => {
        return isOwner(userId, ownerId);
      },
      [requisition.CANCEL]: ({ userId, ownerId }) => {
        return isOwner(userId, ownerId);
      },
      [requisition.PAYMENT]: ({ userId, ownerId }) => {
        return isOwner(userId, ownerId);
      },
      [requisition.ACTIONS]: ({ userId, ownerId }) => {
        return isOwner(userId, ownerId);
      },
      [requisition.CANCEL_TEXT_DETAILS]: ({ userId, ownerId }) => {
        return isOwner(userId, ownerId);
      },
      [cardVerification.READ_DETAILS]: ({ userId, ownerId }) => {
        return isOwner(userId, ownerId);
      },
    },
  },
};

export default rules;
