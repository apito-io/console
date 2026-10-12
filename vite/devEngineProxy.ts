import type { ProxyOptions } from "vite";

const ENGINE_TARGET =
  process.env.VITE_DEV_ENGINE_URL || "http://localhost:5051";

/**
 * Console SPA routes whose path starts with `/system` but are not engine APIs.
 * Vite's `/system` proxy prefix would otherwise forward them to Echo.
 */
const SYSTEM_SPA_PREFIXES = [
  "/system-db",
  "/system-api",
  "/system/plugins",
  "/slow-queries",
  "/logs",
  "/backups",
];

function isSystemSpaRoute(url: string | undefined): boolean {
  const path = (url ?? "").split("?")[0];
  return SYSTEM_SPA_PREFIXES.some(
    (prefix) => path === prefix || path.startsWith(`${prefix}/`),
  );
}

function engineProxy(pathPrefix: string): ProxyOptions {
  return {
    target: ENGINE_TARGET,
    changeOrigin: true,
    ws: pathPrefix === "/system",
    bypass(req) {
      if (pathPrefix === "/system" && isSystemSpaRoute(req.url)) {
        return "/index.html";
      }
    },
  };
}

function enginePath(): ProxyOptions {
  return { target: ENGINE_TARGET, changeOrigin: true };
}

/** Dev-server proxy map: engine REST/GraphQL without breaking SPA routes. */
export function devEngineProxyConfig(): Record<string, ProxyOptions> {
  return {
    "/api": enginePath(),
    "/system": engineProxy("/system"),
    "/secured": enginePath(),
    // API prefixes only. /auth/login stays a console route.
    "/auth/v2": enginePath(),
    "/auth/callback": enginePath(),
    "/auth/refresh": enginePath(),
    "/function": enginePath(),
    "/plugin": enginePath(),
    "/admin": enginePath(),
    "/media": enginePath(),
  };
}
