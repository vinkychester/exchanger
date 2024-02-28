import moment from "moment";

const convertDateToTimestamp = (date) => {
  return date ? (Date.parse(date.split('-').reverse().join('-')) / 1000).toString() : "";
};

const convertDateToTimestampStart = (date) => {
  return date ? (new Date(date.split('-').reverse().join('-')).setHours(0, 0, 0) / 1000).toString() : "";
};
const convertDateToTimestampEnd = (date) => {
  return date ? (new Date(date.split('-').reverse().join('-')).setHours(23, 59, 59) / 1000).toString() : "";
};

const convertDateFromDatePickerToTimestamp = (date) => {
  return Date.parse(date)/1000;
};

const convertDateToLocalDateTime = (date) => {
  return new Date(Date.parse(date.split('-').reverse().join('-')));
};

const convertLocalDateTimeToFormat = (date, format) => {
  return date ? moment(date).format(format) : "";
};

const startCurrentDate = (format) => {
  return moment(new Date(new Date().getFullYear(), new Date().getMonth(), 1)).format(format);
};

const endCurrentDate = (format) => {
  return moment(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)).format(format);
};

export {
  convertDateToTimestamp,
  convertDateToTimestampStart,
  convertDateToTimestampEnd,
  convertDateToLocalDateTime,
  convertLocalDateTimeToFormat,
  convertDateFromDatePickerToTimestamp,
  startCurrentDate,
  endCurrentDate
};
