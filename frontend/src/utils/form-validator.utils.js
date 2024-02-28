let WAValidator = require("multicoin-address-validator");

const validateForm = (form, fields, formErrors) => {

  const validationFunctions = {
    "required": function (name) {
      if (form[name]["value"].length) {
        return {};
      }
      return { 0: "Поле обязательно для заполнения" };
    },
    "wallet": function (name, abbr) {
      if (abbr === "USDT") {
        abbr = "ETH";
      }

      if (!WAValidator.validate(form[name]["value"], abbr.toLowerCase()) && abbr !== "XMR") {
        return { [name]: { 0: "Указан невалидный номер кошелька" } };
      }
      return {};
    }
  };

  const formValidation = (fields) => {
    return Object.keys(fields).reduce(
      (acc, name) => {

        let ruleError = {};

        if (!!form[name]) {
          fields[name].split("|").forEach(
            (rule) => {
              let ruleParams = rule.split(":");
              ruleError = { ...ruleError, ...validationFunctions[ruleParams[0] ?? rule](name, ruleParams[1] ?? "") };
            }
          );
        }

        return {
          errors: {
            ...acc.errors,
            ...ruleError
          }
        };
      },
      {
        errors: {},
      },
    );
  };

  return formValidation(fields);
};

const parseAllMessages = (messages, type = "errors") => {

  let messageArray = [];

  for (let [key, values] of Object.entries(messages[type])) {
    messageArray.push(Object.values(values).join("; "));
  }

  return messageArray;
};

const parseFieldMessages = (messages, field = null, type = "errors") => {
  return messages[type][field] ? Object.values(messages[type][field]).join("; ") : "";
};

export { validateForm, parseAllMessages, parseFieldMessages } ;
