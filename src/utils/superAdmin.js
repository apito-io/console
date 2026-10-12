function truthyClaim(value) {
    if (value === true)
        return true;
    if (typeof value === "string") {
        const normalized = value.trim().toLowerCase();
        return normalized === "true" || normalized === "1";
    }
    return false;
}
/** Console JWT may carry is_super_admin and/or legacy is_admin from the engine. */
export function isSuperAdminFromToken(tokenData) {
    if (!tokenData)
        return false;
    if (truthyClaim(tokenData.is_super_admin))
        return true;
    return truthyClaim(tokenData.is_admin);
}
