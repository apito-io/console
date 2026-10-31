/** Routes that manage their own shell (headers, full-bleed embeds, settings layout). */
const CONSOLE_FULL_BLEED_PREFIXES = [
  "/console/settings",
  "/console/content",
  "/console/model",
  "/console/graphql",
  "/console/rest",
  "/console/realtime",
  "/console/api",
] as const;

export function isConsoleFullBleedRoute(pathname: string): boolean {
  return CONSOLE_FULL_BLEED_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix),
  );
}

export function usesConsolePageBodyPadding(pathname: string): boolean {
  return pathname.startsWith("/console") && !isConsoleFullBleedRoute(pathname);
}
