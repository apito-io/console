import type { TokenData } from "../types/auth";

function truthyClaim(value: unknown): boolean {
  if (value === true) return true;
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    return normalized === "true" || normalized === "1";
  }
  return false;
}

/** Platform operator: JWT `is_super_admin` only. Do not fall back to `is_admin`. */
export function isSuperAdminFromToken(
  tokenData: TokenData | null | undefined
): boolean {
  if (!tokenData) return false;
  return truthyClaim(tokenData.is_super_admin);
}
