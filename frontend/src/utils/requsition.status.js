const requisitionStatusConst = {
  NEW: "NEW",
  // PAYMENT: "PAYMENT",
  INVOICE: "INVOICE",
  PENDING: "PENDING",
  PROCESSED: "PROCESSED",
  FINISHED: "FINISHED",
  CANCELED: "CANCELED",
  DISABLED: "DISABLED",
  // NOT_PAID: "NOT_PAID",
  ERROR: "ERROR",
  CARD_VERIFICATION: "CARD_VERIFICATION",
};

const requisitionStatusArray = {
  NOT_PROCESSING: "NOT_PROCESSING",
  PROCESSING: "PROCESSING",
  REFUND: "REFUND"
};

const arrayValue = (status) => {
  switch (status) {
    case requisitionStatusArray.NOT_PROCESSING: {
      return {
        status: [
          requisitionStatusConst.NEW,
          requisitionStatusConst.CARD_VERIFICATION,
          requisitionStatusConst.INVOICE,
          requisitionStatusConst.PROCESSED
        ]
      } ;
    }
    case requisitionStatusArray.PROCESSING: {
      return {status: [requisitionStatusConst.PENDING, requisitionStatusConst.INVOICE]}
    }
    case requisitionStatusArray.REFUND: {
      return {status: [requisitionStatusConst.DISABLED, requisitionStatusConst.CANCELED], isPaid: true}
    }
    default:
      return  {status: status};
  }
};

const finishStatus = (status) => {
  switch (status) {
    case requisitionStatusConst.NEW:
      return false;
    case requisitionStatusConst.ERROR:
      return false;
    case requisitionStatusConst.CANCELED:
      return false;
    case requisitionStatusConst.DISABLED:
      return false;
    case requisitionStatusConst.FINISHED:
      return false;
    default:
      return true;
  }
};

const requisitionStatus = (status) => {
  switch (status) {
    case requisitionStatusConst.PROCESSED: {
      return "Оплаченная заявка";
    }
    case requisitionStatusConst.INVOICE: {
      return "В обработке";
    }
    case requisitionStatusConst.PENDING: {
      return "В обработке";
    }
    case requisitionStatusConst.FINISHED: {
      return "Выполнена";
    }
    case requisitionStatusConst.CARD_VERIFICATION: {
      return "Отправка средств";
    }
    case requisitionStatusConst.CANCELED: {
      return "Отменена";
    }
    case requisitionStatusConst.DISABLED: {
      return "Закрыта системой";
    }
    case requisitionStatusConst.ERROR: {
      return "Ошибка транзакции";
    }
    case requisitionStatusArray.PROCESSING: {
      return "В обработке";
    }
    case requisitionStatusArray.NOT_PROCESSING: {
      return "Необработанные заявки";
    }
    case requisitionStatusConst.NEW: {
      return "Новая заявка";
    }
    default: {
      return "Не оплачена";
    }
  }
};

export { requisitionStatus, requisitionStatusConst, arrayValue, requisitionStatusArray, finishStatus };
