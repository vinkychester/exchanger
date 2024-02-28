import React from "react";
import Moment from "react-moment";

const format = "DD.MM.YYYY HH:mm:ss";
const format2 = "DD-MM-YYYY";

const TimestampToDate = (str) => {
  return <Moment format={format}>{new Date(str * 1000)}</Moment>;
};
const TimestampToDateNEW = (str) => {
  let date = new Date(str * 1000);
  return <Moment format={format}>{date.setDate(date.getDate()+5)}</Moment>;
};

const TimestampToDateWithoutTime = (str) => {
  return <Moment format={format2}>{new Date(str * 1000)}</Moment>;
};

const DateToFormat = (str) => {
  return <Moment format={format}>{str}</Moment>;
};

export { TimestampToDate, DateToFormat, TimestampToDateWithoutTime, TimestampToDateNEW };
