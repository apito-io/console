/**
 * URL helpers that respect Vite's BASE_URL.
 *
 * `import.meta.env.BASE_URL` always ends with `/`. When the SPA is mounted at
 * the site root it is `/`; under studio it is `/admin/`. Use these helpers any
 * time you need an absolute URL outside the app router (e.g. <img src>,
 * full-page redirects). Router-driven navigation (Link/Navigate/navigate) does
 * NOT need these because TanStack Router handles the base path.
 */

const BASE = (import.meta.env.BASE_URL ?? "/") as string;

/**
 * Build an absolute URL for an asset that lives in the SPA's public/ folder.
 * Pass the path WITHOUT a leading slash, e.g. assetUrl("logo.svg").
 */
export function assetUrl(path: string): string {
  const clean = path.replace(/^\/+/, "");
  return `${BASE}${clean}`;
}

/**
 * Build an absolute URL for an in-app SPA route (used for full-page reloads
 * outside the app router, e.g. window.location.href). Pass the path WITHOUT a
 * leading slash, e.g. spaUrl("auth/login").
 */
export function spaUrl(path: string): string {
  const clean = path.replace(/^\/+/, "");
  return `${BASE}${clean}`;
}
