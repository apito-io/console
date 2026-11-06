import { spaUrl } from "./url";

const AUTH_PATHS = new Set(["/", "/login", "/auth/login"]);

/** Full-page redirect after session cookies are set (login, verify, OAuth). */
export function redirectAfterAuth(pathname?: string): void {
  let guest = "";
  try {
    guest = sessionStorage.getItem("apito_guest_session") || "";
  } catch {
    guest = "";
  }
  if (/^[a-f0-9]{32}$/.test(guest)) {
    window.location.href = `${spaUrl("guest/claim")}?guest_session=${guest}`;
    return;
  }
  const target =
    pathname && !AUTH_PATHS.has(pathname) ? pathname : "/projects";
  const relative = target.replace(/^\/+/, "");
  window.location.href = spaUrl(relative);
}
