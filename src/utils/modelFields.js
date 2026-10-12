function dedupeSubFields(subFields) {
    if (!subFields?.length) {
        return [];
    }
    const seen = new Set();
    const result = [];
    for (const subField of subFields) {
        if (!subField?.identifier) {
            continue;
        }
        if (seen.has(subField.identifier)) {
            if (import.meta.env.DEV) {
                console.warn(`[modelFields] duplicate sub-field identifier "${subField.identifier}" removed`);
            }
            continue;
        }
        seen.add(subField.identifier);
        result.push({
            ...subField,
            sub_field_info: dedupeSubFields(subField.sub_field_info),
        });
    }
    return result;
}
/** Keep the first root field per identifier; dedupe nested sub_field_info recursively. */
export function dedupeFieldsByIdentifier(fields) {
    const seen = new Set();
    const result = [];
    for (const field of fields) {
        if (!field?.identifier) {
            continue;
        }
        if (seen.has(field.identifier)) {
            if (import.meta.env.DEV) {
                console.warn(`[modelFields] duplicate field identifier "${field.identifier}" removed`);
            }
            continue;
        }
        seen.add(field.identifier);
        result.push({
            ...field,
            sub_field_info: dedupeSubFields(field.sub_field_info),
        });
    }
    return result;
}
/** Stable React / dnd-kit id; disambiguates duplicate identifiers from bad schema data. */
export function fieldRowId(field, index) {
    const id = field.identifier?.trim();
    return id ? `${id}__${index}` : `field__${index}`;
}
const ROOT_SORTABLE_PREFIX = "root:";
const NESTED_SORTABLE_PREFIX = "nested:";
/** Globally unique sortable id for root-level fields within a DndContext. */
export function rootSortableId(field, index) {
    return `${ROOT_SORTABLE_PREFIX}${fieldRowId(field, index)}`;
}
/** Globally unique sortable id for nested sub-fields within a DndContext. */
export function nestedSortableId(parentIdentifier, field, index) {
    return `${NESTED_SORTABLE_PREFIX}${parentIdentifier}:${fieldRowId(field, index)}`;
}
/** Extract schema field identifier from a sortable id (root, nested, or legacy). */
export function fieldIdentifierFromSortableId(sortableId) {
    let rowId = sortableId;
    if (sortableId.startsWith(NESTED_SORTABLE_PREFIX)) {
        const rest = sortableId.slice(NESTED_SORTABLE_PREFIX.length);
        const separator = rest.indexOf(":");
        rowId = separator >= 0 ? rest.slice(separator + 1) : rest;
    }
    else if (sortableId.startsWith(ROOT_SORTABLE_PREFIX)) {
        rowId = sortableId.slice(ROOT_SORTABLE_PREFIX.length);
    }
    const match = rowId.match(/^(.+)__\d+$/);
    return match?.[1] ?? rowId;
}
/** Parent field identifier when sortable id is nested; null for root-level ids. */
export function parentIdentifierFromSortableId(sortableId) {
    if (!sortableId.startsWith(NESTED_SORTABLE_PREFIX)) {
        return null;
    }
    const rest = sortableId.slice(NESTED_SORTABLE_PREFIX.length);
    const separator = rest.indexOf(":");
    return separator >= 0 ? rest.slice(0, separator) : null;
}
