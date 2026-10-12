export function selectProjectsList(data) {
    return data?.body ?? [];
}
/**
 * Fingerprint of the shared TanStack Query project list so consumers (e.g. Tour)
 * can re-run reconciliation when the cache updates without issuing another POST
 * `/project/list`.
 */
export function selectProjectListFingerprint(data) {
    return (data?.body ?? [])
        .map((p) => `${p.id}:${p.status ?? ""}:${p.name ?? ""}`)
        .join("|");
}
/**
 * @deprecated Reserved for future REST-backed completion fields. Tour still
 * derives `hasModel` / fields / content from GraphQL + local milestones; this
 * selector ties tour reconciliation to the **same cache generation** as the
 * sidebar project list so we do not add a parallel project-list fetch.
 */
export function selectProjectCompletionCacheGeneration(data) {
    return selectProjectListFingerprint(data);
}
/** Cookie name used for "recent project" shortcut in sidebar. */
export function getRecentProjectIdFromCookie() {
    try {
        return (document.cookie
            .split("; ")
            .find((row) => row.startsWith("project_id="))
            ?.split("=")[1] ?? null);
    }
    catch {
        return null;
    }
}
