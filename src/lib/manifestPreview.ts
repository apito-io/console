/**
 * Verified backend manifests published at apito.io/manifests.
 * Staging writes a local schema draft. It does not publish.
 */

export type ManifestField = {
  identifier: string;
  label: string;
  field_type: string;
  input_type?: string;
  options?: string[];
  required?: boolean;
  description?: string;
};

export type ManifestModel = {
  name: string;
  label?: string;
  description?: string;
  fields: ManifestField[];
};

export type ManifestRelation = {
  from: string;
  to: string;
  forward?: string;
  reverse?: string;
  known_as?: string;
};

export type BackendManifestPreview = {
  id: string;
  slug: string;
  title: string;
  description: string;
  version: string;
  checksum: string;
  models: ManifestModel[];
  relations?: ManifestRelation[];
};

const WEBSITE_MANIFEST_BASE = "https://apito.io/manifests";

export async function fetchManifestPreview(
  manifestId: string,
): Promise<BackendManifestPreview | null> {
  try {
    const res = await fetch(`${WEBSITE_MANIFEST_BASE}/${manifestId}.json`);
    if (!res.ok) return null;
    return (await res.json()) as BackendManifestPreview;
  } catch {
    return null;
  }
}

type GqlClient = {
  mutate: (opts: {
    mutation: unknown;
    variables: Record<string, unknown>;
  }) => Promise<unknown>;
};

function mapFieldType(ft: string): string {
  const t = ft.toLowerCase();
  if (t === "multiline" || t === "richtext") return "multiline";
  if (t === "number" || t === "int" || t === "double") return "number";
  if (t === "boolean" || t === "bool") return "boolean";
  if (t === "date" || t === "datetime") return "date";
  if (t === "list" || t === "select") return "list";
  if (t === "media" || t === "file") return "media";
  return "text";
}

function mapInputType(it: string | undefined, fieldType: string): string {
  if (it) return it;
  if (fieldType === "number") return "double";
  if (fieldType === "boolean") return "bool";
  return "string";
}

/** Mirrors open-core utility/id_check.go: engine identifier from a field label. */
function engineIdentifier(label: string): string {
  return label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_+|_+$/g, "");
}

/**
 * Label the engine will accept for a manifest field, or null to skip it.
 * The engine rejects `status` (publish status), `id`/`_id` (system), `sys_*`,
 * and names starting with a digit. AI proposals and website manifests use
 * `status` often, which used to abort staging halfway.
 */
export function engineSafeFieldLabel(
  model: Pick<ManifestModel, "name" | "label">,
  field: Pick<ManifestField, "identifier" | "label">,
): string | null {
  const label = (field.label || field.identifier || "").trim();
  const id = engineIdentifier(label);
  if (!id || id === "id") return null;
  const owner = (model.label || model.name).trim();
  if (id === "status" || id.startsWith("sys_") || /^\d/.test(id)) {
    return `${owner} ${label}`;
  }
  return label;
}

/**
 * Stage manifest models, fields, and relations into the current project's schema draft.
 * The caller must already be switched into that project. This does not publish.
 */
export async function stageManifestIntoDraft(
  client: GqlClient,
  manifest: BackendManifestPreview,
  mutations: {
    createModel: unknown;
    upsertField: unknown;
    upsertRelation?: unknown;
  },
): Promise<{ models: number; fields: number; relations: number }> {
  let models = 0;
  let fields = 0;
  let relations = 0;

  for (const model of manifest.models) {
    await client.mutate({
      mutation: mutations.createModel,
      variables: { name: model.name, single_record: false },
    });
    models += 1;

    let serial = 1;
    for (const field of model.fields) {
      const field_label = engineSafeFieldLabel(model, field);
      if (!field_label) continue;
      const field_type = mapFieldType(field.field_type);
      const input_type = mapInputType(field.input_type, field_type);
      const validation: Record<string, unknown> = {};
      if (field.required) validation.required = true;
      if (field.options?.length) {
        validation.fixed_list_elements = field.options;
        validation.fixed_list_element_type = "string";
      }
      await client.mutate({
        mutation: mutations.upsertField,
        variables: {
          model_name: model.name,
          field_label,
          field_type,
          input_type,
          serial,
          validation,
          is_update: false,
        },
      });
      fields += 1;
      serial += 1;
    }
  }

  if (mutations.upsertRelation && manifest.relations?.length) {
    for (const rel of manifest.relations) {
      await client.mutate({
        mutation: mutations.upsertRelation,
        variables: {
          from: rel.from,
          to: rel.to,
          forward_connection_type: (rel.forward || "has_many").toLowerCase(),
          reverse_connection_type: (rel.reverse || "has_one").toLowerCase(),
          known_as: rel.known_as,
        },
      });
      relations += 1;
    }
  }

  return { models, fields, relations };
}
