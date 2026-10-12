/** Max rows for schemaChangeExecutionRecords (engine cap is 5000). */
export const SCHEMA_EXECUTION_RECORDS_MAX = 5000;

/**
 * Each pending schema op usually has two ledger rows (system + project).
 * Fetch enough raw records so grouped timeline rows cover all pending ops.
 */
export function schemaExecutionRecordsFetchLimit(pendingOperations?: number | null): number {
  const pending = Math.max(0, pendingOperations ?? 0);
  const estimated = pending * 2 + 100;
  return Math.min(SCHEMA_EXECUTION_RECORDS_MAX, Math.max(500, estimated));
}
