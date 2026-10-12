import { modelKeys, schemaKeys } from "./queryKeys";
const SCHEMA_QUERY_PREFIXES = [
    schemaKeys.all,
    ["schemaVersioningStatus"],
    ["schemaPreview"],
    ["schemaDiff"],
    ["schemaChangeEvents"],
    ["schemaVersions"],
    ["schemaChangeExecutionRecords"],
];
/** Invalidate all schema versioning / draft overlay queries after a staged mutation. */
export function invalidateSchemaDraft(qc) {
    return Promise.all(SCHEMA_QUERY_PREFIXES.map((queryKey) => qc.invalidateQueries({ queryKey: [...queryKey] })));
}
/** Invalidate model list + optional detail after schema or model mutations. */
export function invalidateModelQueries(qc, modelName) {
    const tasks = [
        invalidateSchemaDraft(qc),
        qc.invalidateQueries({ queryKey: modelKeys.all }),
        qc.invalidateQueries({ queryKey: ["getOnlyModelsInfo"] }),
        qc.invalidateQueries({ queryKey: ["getModelDetails"] }),
    ];
    if (modelName) {
        tasks.push(qc.invalidateQueries({ queryKey: modelKeys.detail(modelName) }));
    }
    return Promise.all(tasks);
}
