// Console REST Send uses the login cookie. Code snippets still show Bearer ak_.
export function consoleSessionRequestInit(
  headers: Headers,
  init: RequestInit = {}
): RequestInit {
  headers.delete("Authorization");
  headers.set("X-Use-Cookies", "true");
  return {
    ...init,
    headers,
    credentials: "include",
  };
}

// A pasted API token must not share the request with the console cookie.
// Cookie mode stays available when the explorer has no Authorization header.
export function contentApiRequestInit(
  headers: Headers,
  init: RequestInit = {}
): RequestInit {
  const hasToken = headers.has("Authorization");
  headers.set("X-Use-Cookies", hasToken ? "false" : "true");
  return {
    ...init,
    headers,
    credentials: hasToken ? "omit" : "include",
  };
}
