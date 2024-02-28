Object.filter = (obj, predecate) =>
  Object.fromEntries(Object.entries(obj).filter(predecate));

const refineParams = (params) => {
  return Object.filter(params, ([name, value]) => {
    return value && value !== "all" && value !== undefined && value.toString().trim();
  });
};

const convertDate = (myDate) => {
  if (!!myDate) {
    myDate = myDate.split("-");
    return new Date(myDate[2], myDate[1] - 1, myDate[0]);
  }
};

const clearFilter = (setfilter) => {
  setfilter((prevState) => ({}));
};

Array.prototype.pluck = function (key) {
  return this.map(function (object) { return object[key]; });
};

export { refineParams, convertDate, clearFilter };
