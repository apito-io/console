import type { QueryClient } from "@tanstack/react-query";
import { modelKeys, schemaKeys } from "./queryKeys";

const SCHEMA_QUERY_PREFIXES = [
  schemaKeys.all,
  ["schemaVersioningStatus"],
  ["schemaPreview"],
  ["schemaDiff"],
  ["schemaChangeEvents"],
  ["schemaVersions"],
  ["schemaChangeExecutionRecords"],
] as const;

/** Invalidate all schema versioning / draft overlay queries after a staged mutation. */
export function invalidateSchemaDraft(qc: QueryClient) {
  return Promise.all(
    SCHEMA_QUERY_PREFIXES.map((queryKey) =>
      qc.invalidateQueries({ queryKey: [...queryKey] })
    )
  );
}

/** Invalidate content table rows and sidebar document-count badges after content mutations. */
export function invalidateContentQueries(qc: QueryClient) {
  return Promise.all([
    qc.invalidateQueries({ queryKey: ["GetMultipleData"] }),
    qc.invalidateQueries({ queryKey: ["modelDocumentCounts"] }),
  ]);
}

/** Invalidate model list + optional detail after schema or model mutations. */
export function invalidateModelQueries(
  qc: QueryClient,
  modelName?: string
) {
  const tasks: Promise<void>[] = [
    invalidateSchemaDraft(qc),
    qc.invalidateQueries({ queryKey: modelKeys.all }),
    qc.invalidateQueries({ queryKey: ["getOnlyModelsInfo"] }),
    qc.invalidateQueries({ queryKey: ["getModelDetails"] }),
    qc.invalidateQueries({ queryKey: ["modelDocumentCounts"] }),
  ];
  if (modelName) {
    tasks.push(qc.invalidateQueries({ queryKey: modelKeys.detail(modelName) }));
  }
  return Promise.all(tasks);
}
