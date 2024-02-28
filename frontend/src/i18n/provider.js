import React, { Fragment } from "react";
import { IntlProvider } from "react-intl";

import messages from "./messages";
import { locales } from "./locales";

const Provider = ({ children, locale = locales.RUSSIAN }) => {
  return (
    <IntlProvider
      locale={locale}
      textComponent={Fragment}
      messages={messages[locale]}
    >
      {children}
    </IntlProvider>
  );
};

export default Provider;
