/**
 * Mirrors `open-core/utility/apito_naming.go` for Console validation and previews.
 * Keep in sync with refine-apito `canonicalizeModelName` / derivations.
 */
import pluralize from "pluralize";

const singularKeepAsIs = new Set([
  "news",
  "data",
  "media",
  "analytics",
  "series",
  "species",
  "users",
]);

const canonicalIDRe = /^[a-z][a-z0-9]*(?:_[a-z0-9]+)*$/;

function rejectRunOnLowercaseConcat(raw: string): void {
  if (/[\s_\-]/.test(raw)) return;
  if (/[a-z][A-Z]/.test(raw)) return;
  if (!/^[a-z]+$/.test(raw)) return;
  if (raw.length >= 9) {
    throw new Error(
      "Add a word boundary: food_order, food-order, foodOrder, or \"food order\""
    );
  }
}

function splitCamelPieces(piece: string): string[] {
  const spaced = piece.replace(/([a-z0-9])([A-Z])/g, "$1 $2");
  return spaced
    .split(/\s+/)
    .filter(Boolean)
    .map((s) => s.replace(/[^a-zA-Z0-9]/g, "").toLowerCase())
    .filter(Boolean);
}

function splitIntoWordSegments(raw: string): string[] {
  const normalized = raw.trim().replace(/-/g, "_");
  const chunks = normalized.split(/[\s_]+/).filter((c) => c.length > 0);
  const segments: string[] = [];
  for (const chunk of chunks) {
    const lettersOnly = chunk.replace(/[^a-zA-Z0-9]/g, "");
    const pieces =
      lettersOnly === chunk ? splitCamelPieces(chunk) : [lettersOnly.toLowerCase()];
    for (const p of pieces) {
      const s = p.replace(/[^a-z0-9]/gi, "").toLowerCase();
      if (s) segments.push(s);
    }
  }
  return segments;
}

function singularizeSegment(seg: string): string {
  if (singularKeepAsIs.has(seg)) return seg;
  return pluralize.singular(seg);
}

/**
 * Normalizes admin input to canonical snake_case singular model id (engine `CanonicalizeModelName`).
 */
export function canonicalizeModelName(raw: string): string {
  const t = raw.trim();
  if (!t) throw new Error("Model name is required");
  // Already-canonical ids skip run-on rejection (long singles like "indication").
  if (canonicalIDRe.test(t)) {
    const parts = t.split("_").filter(Boolean);
    parts[parts.length - 1] = singularizeSegment(parts[parts.length - 1]!);
    const out = parts.join("_");
    if (!canonicalIDRe.test(out)) throw new Error("Invalid model name");
    reservedCheck(out);
    return out;
  }
  rejectRunOnLowercaseConcat(t);
  const segments = splitIntoWordSegments(t);
  if (segments.length === 0) throw new Error("Invalid model name");
  segments[segments.length - 1] = singularizeSegment(
    segments[segments.length - 1]!
  );
  const out = segments.join("_");
  if (!canonicalIDRe.test(out)) throw new Error("Invalid model name");
  reservedCheck(out);
  return out;
}

function reservedCheck(canonical: string): void {
  switch (canonical) {
    case "list":
      throw new Error("The name `list` is reserved.");
    case "user":
      throw new Error("The name `user` is protected.");
    case "system":
      throw new Error("The name `system` is not allowed.");
    case "function":
      throw new Error("The name `function` is not allowed.");
  }
}

export function camelFromCanonical(canonical: string): string {
  const parts = canonical.split("_").filter(Boolean);
  return parts
    .map((p, i) =>
      i === 0
        ? p.toLowerCase()
        : p.charAt(0).toUpperCase() + p.slice(1).toLowerCase()
    )
    .join("");
}

export function pascalFromCanonical(canonical: string): string {
  return canonical
    .split("_")
    .filter(Boolean)
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase())
    .join("");
}

/** Human-readable preview for the create-model modal. */
export function previewGraphQLNames(canonical: string): {
  listField: string;
  createMutation: string;
  singularType: string;
} {
  const singular = camelFromCanonical(canonical);
  const pascal = pascalFromCanonical(canonical);
  return {
    listField: `${singular}List`,
    createMutation: `create${pascal}`,
    singularType: pascal,
  };
}
