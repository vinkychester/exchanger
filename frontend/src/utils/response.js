const mercureUrl = new URL("https://coin24.com.ua/.well-known/mercure"); // https://hub.itlab-studio.com/.well-known/mercure

const parseApiErrors = (graphQLErrors) => {
  let errors = {};

  if (graphQLErrors) {
    graphQLErrors.map(({ message, extensions }) => {
      if ("internal" === extensions.category) {
        if (message.includes(":")) {
          Object.entries(JSON.parse(message)).forEach(([key, value]) =>
            errors[key] = value.trim()
          );
        } else {
          errors["internal"] = message;
        }
      } else if (extensions.violations) {
        extensions.violations.map(
          ({ path, message }) => (errors[path] = message)
        );
      } else if (403 === extensions.status && "user" === extensions.category) {
        errors["user"] = message;
      }
    });
  }
  return errors;
};

const parseIRI = (IRI) => {
  const regex = /\d+/i;
  return +IRI.match(regex)[0];
};

const parseUuidIRI = (IRI) => {
  return IRI.split("/")[3];
};

export { mercureUrl, parseApiErrors, parseIRI, parseUuidIRI };
