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
