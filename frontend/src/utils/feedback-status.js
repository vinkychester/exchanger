import React from "react";

const feedbackStatusConst = {
  NOT_VIEWED: "not_viewed",
  VIEWED: "viewed",
  WELL_DONE: "well_done",
  DELETED: "deleted"
};

const feedbackStatus = (status) => {
  switch (status) {
    case feedbackStatusConst.NOT_VIEWED: {
      return "Не просмотрен";
    }
    case feedbackStatusConst.VIEWED: {
      return "Просмотрен";
    }
    case feedbackStatusConst.WELL_DONE: {
      return "Обработан";
    }
    case feedbackStatusConst.DELETED: {
      return "Удален";
    }
  }
};

const feedbackTypeCons = {
  CASH: "cash",
  BANK: "bank"
};

const feedbackType = (type) => {
  switch (type) {
    case feedbackTypeCons.CASH: {
      return "Наличный расчет";
    }
    case feedbackTypeCons.BANK: {
      return "Безналичный расчет";
    }
  }
};

const author = {
  MANAGER: 'manager',
  CLIENT: 'client',
};

const authorType = (type) => {
  switch (type) {
    case author.CLIENT: {
      return 'Клиент';
    }
    case author.MANAGER: {
      return 'Администратор';
    }
  }
};

export {
  feedbackStatusConst,
  feedbackStatus,
  feedbackTypeCons,
  feedbackType,
  author,
  authorType
};