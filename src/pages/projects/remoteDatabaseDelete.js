/** Engines where optional platform/remote DB teardown is supported on delete. */
const REMOTE_DELETE_ENGINES = new Set([
    "libsql",
    "turso",
    "neon",
    "postgresql",
    "postgres",
    "mysql",
    "mariadb",
]);
/**
 * True when the delete modal should offer "Also delete remote database".
 * Uses driver engine from the project list — not plan_type — so dedicated SaaS
 * projects provisioned on Turso/Neon/SQL still get the opt-in.
 */
export function canOfferRemoteDatabaseDelete(project) {
    if (!project)
        return false;
    const db = (project.db || "").toLowerCase().trim();
    if (!db || db === "apitodb" || db.includes("coredb")) {
        return false;
    }
    return REMOTE_DELETE_ENGINES.has(db);
}
