import type {
  ConnectionInfo,
  FieldInfo,
} from "../../types/model";
import type {
  SchemaDraftOverlay,
  SchemaDraftOverlayModel,
  SchemaOverlayChangeKind,
  SchemaOverlayConnectionState,
  SchemaOverlayFieldState,
  SchemaOverlayModelMeta,
} from "../../types/schemaDraftOverlay";
import { dedupeFieldsByIdentifier } from "../../utils/modelFields";

type RawModel = {
  name?: string;
  single_page?: boolean;
  single_page_uuid?: string;
  system_generated?: boolean;
  has_connections?: boolean;
  enable_revision?: boolean;
  revision_filter?: SchemaDraftOverlayModel["revision_filter"];
  fields?: FieldInfo[];
  connections?: ConnectionInfo[];
};

type SchemaDiffPayload = {
  model_changes?: Array<{
    model_name?: string;
    added?: boolean;
    removed?: boolean;
    fields_added?: FieldInfo[];
    fields_removed?: FieldInfo[];
    fields_modified?: Array<{ identifier?: string; label?: string }>;
    connections_added?: ConnectionInfo[];
    connections_removed?: ConnectionInfo[];
  }>;
};

type SchemaChangeEvent = {
  event_type?: string;
  payload_json?: string;
};

type StagedOperation = {
  type?: string;
  model_name?: string;
  field_name?: string;
  payload?: Record<string, unknown>;
};

function parseJson<T>(raw: unknown, fallback: T): T {
  if (raw == null || raw === "") {
    return fallback;
  }
  if (typeof raw === "object") {
    return raw as T;
  }
  try {
    return JSON.parse(String(raw)) as T;
  } catch {
    return fallback;
  }
}

function connectionKey(connection: ConnectionInfo): string {
  return `${connection.model ?? ""}|${connection.relation ?? ""}|${connection.type ?? ""}|${connection.known_as ?? ""}`;
}

function fieldPathKey(path: string): string {
  return `path:${path}`;
}

function fieldIdentifierKey(identifier: string): string {
  return `id:${identifier}`;
}

function collectFieldIdentifierCounts(
  fields: FieldInfo[],
  counts: Map<string, number>
) {
  for (const field of fields) {
    if (!field?.identifier) {
      continue;
    }
    counts.set(field.identifier, (counts.get(field.identifier) ?? 0) + 1);
    collectFieldIdentifierCounts(field.sub_field_info ?? [], counts);
  }
}

function collectAddedFieldPaths(
  liveFields: FieldInfo[],
  draftFields: FieldInfo[],
  parentPath: string[],
  states: Map<string, SchemaOverlayFieldState>
) {
  const liveByIdentifier = new Map(
    liveFields
      .filter((field) => !!field?.identifier)
      .map((field) => [field.identifier!, field])
  );

  for (const draftField of draftFields) {
    if (!draftField?.identifier) {
      continue;
    }
    const path = [...parentPath, draftField.identifier];
    const liveField = liveByIdentifier.get(draftField.identifier);
    if (!liveField) {
      states.set(fieldPathKey(path.join(".")), { kind: "added" });
    }
    collectAddedFieldPaths(
      liveField?.sub_field_info ?? [],
      draftField.sub_field_info ?? [],
      path,
      states
    );
  }
}

function normalizeModel(raw: RawModel, meta: SchemaOverlayModelMeta): SchemaDraftOverlayModel | null {
  if (!raw.name || raw.system_generated) {
    return null;
  }
  return {
    name: raw.name,
    single_page: raw.single_page,
    single_page_uuid: raw.single_page_uuid,
    system_generated: raw.system_generated,
    has_connections: raw.has_connections,
    enable_revision: raw.enable_revision,
    revision_filter: raw.revision_filter,
    fields: dedupeFieldsByIdentifier(raw.fields ?? []),
    connections: raw.connections ?? [],
    overlayMeta: meta,
  };
}

function modelsFromSchema(schema: { models?: RawModel[] } | null): RawModel[] {
  return (schema?.models ?? []).filter(Boolean) as RawModel[];
}

function parseStagedOperations(raw: unknown): StagedOperation[] {
  const parsed = parseJson<unknown>(raw, []);
  if (Array.isArray(parsed)) {
    return parsed.filter(Boolean) as StagedOperation[];
  }
  if (parsed && typeof parsed === "object") {
    const obj = parsed as Record<string, unknown>;
    // Reject-row audit events reuse operation_added but payload is not an ops list.
    if ("rejected_operation_id" in obj) {
      return [];
    }
    if (typeof obj.type === "string") {
      return [obj as StagedOperation];
    }
  }
  return [];
}

function extractRenameHints(events: SchemaChangeEvent[]) {
  const fieldRenames = new Map<string, Map<string, string>>();
  const modelRenames = new Map<string, string>();

  for (const event of events) {
    if (!event || event.event_type !== "operation_added") {
      continue;
    }
    const ops = parseStagedOperations(event.payload_json);
    for (const op of ops) {
      if (!op?.type) {
        continue;
      }
      const payload = op.payload ?? {};
      if (op.type === "model_field_operation") {
        const opKind = String(payload.type ?? "").toLowerCase();
        if (opKind !== "rename") {
          continue;
        }
        const modelName = String(payload.model_name ?? op.model_name ?? "");
        const oldName = String(payload.field_name ?? op.field_name ?? "");
        const newName = String(payload.new_name ?? "");
        if (!modelName || !oldName || !newName) {
          continue;
        }
        if (!fieldRenames.has(modelName)) {
          fieldRenames.set(modelName, new Map());
        }
        fieldRenames.get(modelName)!.set(newName, oldName);
      }
      if (op.type === "rename_model" || op.type === "update_model") {
        const opKind = String(payload.type ?? op.type ?? "").toLowerCase();
        if (opKind.includes("rename")) {
          const oldName = String(payload.model_name ?? op.model_name ?? "");
          const newName = String(payload.new_name ?? "");
          if (oldName && newName) {
            modelRenames.set(newName, oldName);
          }
        }
      }
    }
  }

  return { fieldRenames, modelRenames };
}

export interface BuildSchemaDraftOverlayInput {
  enabled: boolean;
  hasDraft: boolean;
  activeVersion: number;
  changesetId?: string;
  pendingOperations: number;
  livePreviewJson?: string | null;
  draftPreviewJson?: string | null;
  diffJson?: string | null;
  changeEvents?: SchemaChangeEvent[] | null;
}

export function buildSchemaDraftOverlay(
  input: BuildSchemaDraftOverlayInput
): Omit<
  SchemaDraftOverlay,
  "loading" | "refresh" | "enabled" | "hasDraft"
> {
  const targetVersion = Math.max(1, (input.activeVersion ?? 0) + 1);
  const draftVersionLabel = `Draft v${targetVersion}`;

  if (!input.enabled || !input.hasDraft) {
    return {
      activeVersion: input.activeVersion ?? 0,
      targetVersion,
      changesetId: input.changesetId,
      pendingOperations: input.pendingOperations ?? 0,
      draftVersionLabel,
      models: [],
      getModelOverlay: () => null,
      getModelChangeKind: () => "live",
      getFieldOverlay: () => ({ kind: "live" }),
      getConnectionOverlay: () => ({ kind: "live" }),
    };
  }

  const liveSchema = parseJson<{ models?: RawModel[] }>(
    input.livePreviewJson,
    { models: [] }
  );
  const draftSchema = parseJson<{ models?: RawModel[] }>(
    input.draftPreviewJson,
    { models: [] }
  );
  const diff = parseJson<SchemaDiffPayload>(input.diffJson, {});
  const events = input.changeEvents ?? [];
  const { fieldRenames, modelRenames } = extractRenameHints(events);

  const liveModels = modelsFromSchema(liveSchema);
  const draftModels = modelsFromSchema(draftSchema);
  const liveByName = new Map(liveModels.map((m) => [m.name ?? "", m]));
  const draftByName = new Map(draftModels.map((m) => [m.name ?? "", m]));

  const modelKindByName = new Map<string, SchemaOverlayChangeKind>();
  const fieldKindByModel = new Map<string, Map<string, SchemaOverlayFieldState>>();
  const fieldIdentifierCountsByModel = new Map<string, Map<string, number>>();
  const connectionKindByModel = new Map<
    string,
    Map<string, SchemaOverlayConnectionState>
  >();
  const removedModels = new Map<string, RawModel>();

  for (const change of diff.model_changes ?? []) {
    const modelName = change.model_name ?? "";
    if (!modelName) {
      continue;
    }

    if (change.added) {
      modelKindByName.set(modelName, "added");
    } else if (change.removed) {
      modelKindByName.set(modelName, "removed");
      const liveModel = liveByName.get(modelName);
      if (liveModel) {
        removedModels.set(modelName, liveModel);
      }
      continue;
    } else {
      modelKindByName.set(modelName, "modified");
    }

    const fieldMap =
      fieldKindByModel.get(modelName) ?? new Map<string, SchemaOverlayFieldState>();
    for (const field of change.fields_added ?? []) {
      if (!field?.identifier) {
        continue;
      }
      const renameFrom = fieldRenames.get(modelName)?.get(field.identifier);
      fieldMap.set(fieldIdentifierKey(field.identifier), {
        kind: renameFrom ? "modified" : "added",
        previousIdentifier: renameFrom,
        previousLabel: renameFrom,
      });
    }
    for (const field of change.fields_removed ?? []) {
      if (!field?.identifier) {
        continue;
      }
      fieldMap.set(fieldIdentifierKey(field.identifier), {
        kind: "removed",
        previousLabel: field.label,
        previousIdentifier: field.identifier,
      });
    }
    for (const field of change.fields_modified ?? []) {
      if (!field?.identifier) {
        continue;
      }
      fieldMap.set(fieldIdentifierKey(field.identifier), { kind: "modified" });
    }
    fieldKindByModel.set(modelName, fieldMap);

    const connMap =
      connectionKindByModel.get(modelName) ??
      new Map<string, SchemaOverlayConnectionState>();
    for (const conn of change.connections_added ?? []) {
      connMap.set(connectionKey(conn), { kind: "added" });
    }
    for (const conn of change.connections_removed ?? []) {
      connMap.set(connectionKey(conn), { kind: "removed" });
    }
    connectionKindByModel.set(modelName, connMap);
  }

  // A model can reuse an identifier at different nesting paths. The diff's
  // `fields_added` list alone cannot distinguish class.sections.name from
  // class.divisions.sections.name, so derive path-specific additions directly
  // from the live and draft trees.
  for (const draftModel of draftModels) {
    if (!draftModel.name) {
      continue;
    }
    const states =
      fieldKindByModel.get(draftModel.name) ??
      new Map<string, SchemaOverlayFieldState>();
    const counts = new Map<string, number>();
    collectFieldIdentifierCounts(draftModel.fields ?? [], counts);
    fieldIdentifierCountsByModel.set(draftModel.name, counts);
    collectAddedFieldPaths(
      liveByName.get(draftModel.name)?.fields ?? [],
      draftModel.fields ?? [],
      [],
      states
    );
    fieldKindByModel.set(draftModel.name, states);
  }

  const mergedModels: SchemaDraftOverlayModel[] = [];
  const renamedAway = new Set(modelRenames.values());

  for (const draftModel of draftModels) {
    if (!draftModel.name) {
      continue;
    }
    let kind: SchemaOverlayChangeKind =
      modelKindByName.get(draftModel.name) ??
      (draftByName.has(draftModel.name) && !liveByName.has(draftModel.name)
        ? "added"
        : "live");
    const previousName = modelRenames.get(draftModel.name);
    // Renames must never look like brand-new models in the designer.
    if (previousName) {
      kind = "modified";
    }
    const overlayModel = normalizeModel(draftModel, {
      kind: kind === "live" && previousName ? "modified" : kind,
      previousName,
    });
    if (!overlayModel) {
      continue;
    }

    const removedFieldMap = fieldKindByModel.get(draftModel.name);
    const removedFields =
      diff.model_changes
        ?.find((mc) => mc.model_name === draftModel.name)
        ?.fields_removed?.filter((f) => f?.identifier) ?? [];

    if (removedFields.length > 0) {
      const existingIds = new Set(
        (overlayModel.fields ?? []).map((f) => f.identifier).filter(Boolean)
      );
      for (const removed of removedFields) {
        if (!removed.identifier || existingIds.has(removed.identifier)) {
          continue;
        }
        overlayModel.fields = [...(overlayModel.fields ?? []), removed];
      }
    }

    if (removedFieldMap) {
      for (const [key, state] of removedFieldMap) {
        if (state.kind !== "removed") {
          continue;
        }
        if (!key.startsWith("id:")) {
          continue;
        }
        const identifier = key.slice(3);
        const exists = overlayModel.fields?.some(
          (f) => f.identifier === identifier
        );
        if (exists) {
          continue;
        }
        const liveField = liveByName
          .get(draftModel.name)
          ?.fields?.find((f) => f.identifier === identifier);
        if (liveField) {
          overlayModel.fields = [...(overlayModel.fields ?? []), liveField];
        }
      }
    }

    mergedModels.push(overlayModel);
  }

  for (const [removedName, liveModel] of removedModels) {
    if (mergedModels.some((m) => m.name === removedName)) {
      continue;
    }
    // Old name of a rename already appears as previousName on the new model.
    if (renamedAway.has(removedName)) {
      continue;
    }
    const overlayModel = normalizeModel(liveModel, {
      kind: "removed",
      previousName: modelRenames.get(removedName),
    });
    if (overlayModel) {
      mergedModels.push(overlayModel);
    }
  }

  mergedModels.sort((a, b) => a.name.localeCompare(b.name));

  const modelByName = new Map(mergedModels.map((m) => [m.name.toLowerCase(), m]));

  return {
    activeVersion: input.activeVersion ?? 0,
    targetVersion,
    changesetId: input.changesetId,
    pendingOperations: input.pendingOperations ?? 0,
    draftVersionLabel,
    models: mergedModels,
    getModelOverlay: (modelName: string) => {
      if (!modelName) {
        return null;
      }
      return modelByName.get(modelName.toLowerCase()) ?? null;
    },
    getModelChangeKind: (modelName: string) => {
      const model = modelByName.get(modelName.toLowerCase());
      return model?.overlayMeta.kind ?? "live";
    },
    getFieldOverlay: (
      modelName: string,
      fieldIdentifier: string,
      fieldPath?: string
    ) => {
      const perModel = fieldKindByModel.get(modelName);
      const fromPath = fieldPath
        ? perModel?.get(fieldPathKey(fieldPath))
        : undefined;
      if (fromPath) {
        return fromPath;
      }
      const uniqueIdentifier =
        (fieldIdentifierCountsByModel.get(modelName)?.get(fieldIdentifier) ?? 0) <= 1;
      const fromDiff = uniqueIdentifier
        ? perModel?.get(fieldIdentifierKey(fieldIdentifier))
        : undefined;
      if (fromDiff) {
        return fromDiff;
      }
      const modelKind = modelKindByName.get(modelName);
      if (modelKind === "added") {
        return { kind: "added" };
      }
      return { kind: "live" };
    },
    getConnectionOverlay: (modelName: string, connection: ConnectionInfo) => {
      const perModel = connectionKindByModel.get(modelName);
      const fromDiff = perModel?.get(connectionKey(connection));
      if (fromDiff) {
        return fromDiff;
      }
      const modelKind = modelKindByName.get(modelName);
      if (modelKind === "added") {
        return { kind: "added" };
      }
      return { kind: "live" };
    },
  };
}
