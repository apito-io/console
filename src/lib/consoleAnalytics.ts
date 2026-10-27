import { getConsoleDomain } from "../utils/env";

const ALLOWED_KEYS = new Set([
  "project_id",
  "driver",
  "template",
  "field_count",
  "key_role",
  "method",
  "protocol",
  "feature_category",
]);

const SECRET_VALUE = /^(ak_|sk_)|eyJ|@|\\|\/|https?:/;

export function analyticsHostBlocked(hostname: string): boolean {
  return (
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname.endsWith(".pages.dev")
  );
}

export function allowlistedAnalyticsProps(
  props: Record<string, unknown>,
): Record<string, string | number | boolean> {
  const safe: Record<string, string | number | boolean> = {};
  for (const [key, value] of Object.entries(props)) {
    if (!ALLOWED_KEYS.has(key)) continue;
    if (typeof value === "number" || typeof value === "boolean") {
      safe[key] = value;
      continue;
    }
    if (typeof value !== "string") continue;
    if (SECRET_VALUE.test(value)) continue;
    safe[key] = value;
  }
  return safe;
}

/** New funnel events. Existing captures stay on their current callers. */
export function analyticsProduct(): "apito" | "sqlitebuilder" {
  if (typeof window === "undefined") return "apito";
  return window.env?.VITE_PRODUCT === "sqlitebuilder" ? "sqlitebuilder" : "apito";
}

export function captureConsoleEvent(
  eventName: string,
  props: Record<string, unknown> = {},
): void {
  if (typeof window === "undefined" || !window.posthog) return;
  if (analyticsHostBlocked(window.location.hostname)) return;
  window.posthog.capture(eventName, {
    ...allowlistedAnalyticsProps(props),
    product: analyticsProduct(),
    domain: getConsoleDomain(),
    surface: "console",
  });
}
