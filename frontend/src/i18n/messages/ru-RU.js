import { locales } from "../locales";
import { requisitionStatusArray, requisitionStatusConst } from "../../utils/requsition.status";
import { creditCardStatuses } from "../../utils/consts.util";

export default {
  [locales.RUSSIAN]: {
    cardNumber: "Номер карты",
    wallet: "Кошелек",
    email: "Электронная почта",
    expiryMonth: "Месяц",
    expiryYear: "Год",
    cardHolder: "Имя Фамилия",
    cardHolderCountry: "Страна проживания",
    cardHolderCity: "Город проживания",
    cardHolderDOB: "Дата рождения",
    cityId: "Город",
    internal: "Внутренняя сеть",
    external: "Внешняя сеть",
    networkId: "Сеть",
    address: "Адрес пункта выдачи",
    name: "Название пункта выдачи",
    description: "Описание пункта выдачи",
    cashierId: "Менеджер пункта выдачи",
    exchangePointId: "Пункт обмена",
    referenceId: "Идентификатор заявки",
    contacts: "Дополнительная информация",
    
    [requisitionStatusConst.NEW]: "Новая заявка",
    [requisitionStatusConst.PENDING]: "В обработке",
    // [requisitionStatusConst.PAYMENT]: "Ожидается оплата",
    [requisitionStatusConst.PROCESSED]: "Оплаченные заявки",
    [requisitionStatusConst.FINISHED]: "Выполненые заявки",
    [requisitionStatusConst.CANCELED]: "Отмененные заявки",
    [requisitionStatusConst.DISABLED]: "Закрытые заявки",
    [requisitionStatusConst.ERROR]: "Ошибка при выплате",
    [requisitionStatusConst.CARD_VERIFICATION]: "Верификация карты",
    [requisitionStatusArray.NOT_PROCESSING]: "Необработанные заявки",
    [requisitionStatusArray.PROCESSING]: "В обработке",

    [creditCardStatuses.VERIFIED]: "Верифицирована",
    [creditCardStatuses.NOT_VERIFIED]: "Ожидает верификации",
    [creditCardStatuses.CANCELED]: "Отменена",
    [creditCardStatuses.PAST_DUE_DATE]: "Просрочена",
  },
};
