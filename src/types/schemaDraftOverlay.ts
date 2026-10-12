import type { ConnectionInfo, FieldInfo } from "./model";

/** How a model/field/relation appears in the draft overlay UI. */
export type SchemaOverlayChangeKind = "live" | "added" | "modified" | "removed";

export interface SchemaOverlayModelMeta {
  kind: SchemaOverlayChangeKind;
  /** Previous model name when renamed in draft. */
  previousName?: string;
}

export interface SchemaOverlayFieldState {
  kind: SchemaOverlayChangeKind;
  previousLabel?: string;
  previousIdentifier?: string;
}

export interface SchemaOverlayConnectionState {
  kind: SchemaOverlayChangeKind;
}

export interface SchemaDraftOverlayModel {
  name: string;
  single_page?: boolean;
  single_page_uuid?: string;
  system_generated?: boolean;
  has_connections?: boolean;
  enable_revision?: boolean;
  revision_filter?: { key?: string | null; value?: string | null }[] | null;
  fields?: FieldInfo[];
  connections?: ConnectionInfo[];
  overlayMeta: SchemaOverlayModelMeta;
}

/** Pro supplies this via ConsoleExtensions when schema versioning is enabled. */
export interface SchemaDraftOverlay {
  enabled: boolean;
  hasDraft: boolean;
  loading: boolean;
  activeVersion: number;
  targetVersion: number;
  changesetId?: string;
  pendingOperations: number;
  draftVersionLabel: string;
  models: SchemaDraftOverlayModel[];
  getModelOverlay: (modelName: string) => SchemaDraftOverlayModel | null;
  getModelChangeKind: (modelName: string) => SchemaOverlayChangeKind;
  getFieldOverlay: (
    modelName: string,
    fieldIdentifier: string,
    fieldPath?: string
  ) => SchemaOverlayFieldState;
  getConnectionOverlay: (
    modelName: string,
    connection: ConnectionInfo
  ) => SchemaOverlayConnectionState;
  refresh: () => Promise<void>;
}

export const EMPTY_SCHEMA_DRAFT_OVERLAY: SchemaDraftOverlay = {
  enabled: false,
  hasDraft: false,
  loading: false,
  activeVersion: 0,
  targetVersion: 0,
  pendingOperations: 0,
  draftVersionLabel: "",
  models: [],
  getModelOverlay: () => null,
  getModelChangeKind: () => "live",
  getFieldOverlay: () => ({ kind: "live" }),
  getConnectionOverlay: () => ({ kind: "live" }),
  refresh: async () => {},
};
