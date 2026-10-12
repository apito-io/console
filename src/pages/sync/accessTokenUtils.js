export const ACCESS_TOKEN_TYPES = [
    { label: "CLI", value: "cli" },
    { label: "SDK", value: "sdk" },
    { label: "MCP", value: "mcp" },
];
/** Resolve token type from API field or legacy prefix on token string. */
export function resolveTokenType(token) {
    const t = token.token_type?.toLowerCase();
    if (t === "cli" || t === "sdk" || t === "mcp") {
        return t;
    }
    const raw = token.token ?? "";
    if (raw.startsWith("mcp-"))
        return "mcp";
    if (raw.startsWith("sdk-"))
        return "sdk";
    if (raw.startsWith("cli-"))
        return "cli";
    return "legacy";
}
export function isMcpToken(token) {
    return resolveTokenType(token) === "mcp";
}
export function tokenTypeLabel(token) {
    const kind = resolveTokenType(token);
    if (kind === "legacy")
        return "Legacy";
    return kind.toUpperCase();
}
