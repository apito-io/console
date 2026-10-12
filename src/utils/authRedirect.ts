import { spaUrl } from "./url";

const AUTH_PATHS = new Set(["/", "/login", "/auth/login"]);

/** Full-page redirect after session cookies are set (login, verify, OAuth). */
export function redirectAfterAuth(pathname?: string): void {
  const target =
    pathname && !AUTH_PATHS.has(pathname) ? pathname : "/projects";
  const relative = target.replace(/^\/+/, "");
  window.location.href = spaUrl(relative);
}
