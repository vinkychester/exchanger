export const pageToUrl = (history, param, page) => {
  const url = new URL(window.location.href);
  url.searchParams.set(param, page.toString());

  history.push({
    pathname: url.pathname,
    search: url.search,
  });
};
