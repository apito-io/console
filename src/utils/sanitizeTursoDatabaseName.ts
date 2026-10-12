/** Mirror engine sanitizeTursoDatabaseName for Turso project-create UI autofill. */
export function sanitizeTursoDatabaseName(
  hint: string,
  projectId: string
): string {
  const sanitizer = /[^a-z0-9-]/g;
  const h = hint.trim().toLowerCase();
  if (h && h.length <= 60) {
    let cleaned = h.replace(sanitizer, "-").replace(/^-+|-+$/g, "");
    if (cleaned) return cleaned;
  }
  let base = projectId
    .trim()
    .toLowerCase()
    .replace(sanitizer, "-")
    .replace(/^-+|-+$/g, "");
  if (!base) base = "apito";
  let name = `apito-${base}`;
  if (name.length > 60) name = name.slice(0, 60);
  return name.replace(/^-+|-+$/g, "");
}
