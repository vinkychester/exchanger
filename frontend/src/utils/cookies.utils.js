
export const checkCookiesAndSet = (trustedCookies, setCookie) => {
  let params = (new URL(document.location)).searchParams;

  trustedCookies.forEach(cookie => {
    if (!!params.get(cookie)) {
      setCookie(cookie, params.get(cookie), { path: "/" });
    }
  });
};

export const checkAndSetSingle = (cookieName, cookieValue, setCookie) => {
  if (!!cookieName && !!cookieValue) {
    setCookie(cookieName, cookieValue, { path: "/" });
  }
};


