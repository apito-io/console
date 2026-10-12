import { graphqlFetcher } from "../../lib/graphqlFetcher";
import { ENV } from "../../utils/env";

export type FunctionGraphQLExposure = "Query" | "Mutation";

export type ProjectFunctionRow = {
  name?: string | null;
  description?: string | null;
  graphql_schema_type?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  trigger_type?: string | null;
  source?: string | null;
  active_revision_id?: string | null;
  capabilities?: Array<string | null> | null;
  rest_api_secret_url_key?: string | null;
  runtime_config?: {
    runtime?: string | null;
    memory?: number | null;
    time_out?: number | null;
    handler?: string | null;
  } | null;
  request?: { model?: string | null; optional_payload?: boolean | null } | null;
  response?: { model?: string | null; is_array?: boolean | null } | null;
};

export type FunctionRevisionRow = {
  id?: string | null;
  name?: string | null;
  revision?: number | null;
  source?: string | null;
  artifact_key?: string | null;
  artifact_hash?: string | null;
  created_by?: string | null;
  created_at?: string | null;
  capabilities?: Array<string | null> | null;
};

export type FunctionDeploymentRow = {
  id?: string | null;
  name?: string | null;
  revision_id?: string | null;
  status?: string | null;
  deployed_by?: string | null;
  rollback_of?: string | null;
  created_at?: string | null;
  environment?: string | null;
};

export type DraftTestResult = {
  ok?: boolean | null;
  response?: unknown;
  error?: string | null;
  error_class?: string | null;
  duration_ms?: number | null;
  invocation_id?: string | null;
  logs?: Array<{ level?: string | null; message?: string | null } | null> | null;
};

export type FunctionDeployStatus = "never_deployed" | "draft_changes" | "deployed";

export function deriveFunctionStatus(
  fn: Pick<ProjectFunctionRow, "source" | "active_revision_id">,
  revisionSource?: string | null,
): FunctionDeployStatus {
  if (!fn.active_revision_id) return "never_deployed";
  if (
    revisionSource != null &&
    (fn.source ?? "").trim() !== revisionSource.trim()
  ) {
    return "draft_changes";
  }
  // Without revision source comparison, treat missing active revision source as deployed
  // when active_revision_id is set; dirty detection uses local draft vs last loaded baseline.
  return "deployed";
}

export function statusLabel(status: FunctionDeployStatus): string {
  switch (status) {
    case "never_deployed":
      return "Never deployed";
    case "draft_changes":
      return "Draft changes";
    default:
      return "Deployed";
  }
}

export function statusColor(
  status: FunctionDeployStatus,
): "default" | "orange" | "green" {
  switch (status) {
    case "never_deployed":
      return "default";
    case "draft_changes":
      return "orange";
    default:
      return "green";
  }
}

const LIST_FUNCTIONS = `
  query getAllFunctionInfo {
    projectFunctionsInfo {
      name
      description
      graphql_schema_type
      created_at
      updated_at
      trigger_type
      source
      active_revision_id
      capabilities
      rest_api_secret_url_key
      request {
        model
        optional_payload
      }
      response {
        model
        is_array
      }
      runtime_config {
        handler
        memory
        runtime
        time_out
      }
    }
  }
`;

const UPSERT_FUNCTION = `
  mutation upsertFunctionToProject(
    $name: String!
    $description: String
    $graphql_schema_type: String
    $runtime_config: Function_Provider_Config_Payload
    $request: String
    $request_payload_is_optional: Boolean
    $response: String
    $response_is_array: Boolean
    $update: Boolean
    $source: String
    $trigger_type: String
    $language: String
    $capabilities: [String]
  ) {
    upsertFunctionToProject(
      name: $name
      description: $description
      graphql_schema_type: $graphql_schema_type
      runtime_config: $runtime_config
      request: $request
      request_payload_is_optional: $request_payload_is_optional
      response: $response
      response_is_array: $response_is_array
      update: $update
      source: $source
      trigger_type: $trigger_type
      language: $language
      capabilities: $capabilities
    ) {
      name
      graphql_schema_type
      trigger_type
      source
      active_revision_id
      capabilities
      rest_api_secret_url_key
      updated_at
      runtime_config {
        runtime
      }
    }
  }
`;

const DEPLOY_FUNCTION = `
  mutation deployFunctionToProject($name: String!, $source: String) {
    deployFunctionToProject(name: $name, source: $source) {
      function {
        name
        source
        active_revision_id
        rest_api_secret_url_key
        updated_at
      }
      revision {
        id
        revision
        artifact_key
        artifact_hash
        created_at
      }
      deployment {
        id
        revision_id
        status
        created_at
      }
    }
  }
`;

const ROLLBACK_FUNCTION = `
  mutation rollbackFunctionDeployment($name: String!, $revision_id: String!) {
    rollbackFunctionDeployment(name: $name, revision_id: $revision_id) {
      function {
        name
        source
        active_revision_id
        updated_at
      }
      revision {
        id
        artifact_key
        created_at
      }
      deployment {
        id
        revision_id
        status
        rollback_of
        created_at
      }
    }
  }
`;

const TEST_DRAFT = `
  mutation testFunctionDraft(
    $name: String!
    $source: String
    $payload: JSON
    $tenant_id: String
  ) {
    testFunctionDraft(
      name: $name
      source: $source
      payload: $payload
      tenant_id: $tenant_id
    ) {
      ok
      response
      error
      error_class
      duration_ms
      invocation_id
      logs {
        level
        message
      }
    }
  }
`;

const LIST_REVISIONS = `
  query listFunctionRevisions($name: String!, $limit: Int) {
    listFunctionRevisions(name: $name, limit: $limit) {
      id
      name
      revision
      source
      artifact_key
      artifact_hash
      created_by
      created_at
      capabilities
    }
  }
`;

const LIST_DEPLOYMENTS = `
  query listFunctionDeployments($name: String!, $limit: Int) {
    listFunctionDeployments(name: $name, limit: $limit) {
      id
      name
      revision_id
      status
      deployed_by
      rollback_of
      created_at
      environment
    }
  }
`;

const DELETE_FUNCTION = `
  mutation deleteFunctionFromProject($function: String!) {
    deleteFunctionFromProject(function: $function) {
      name
    }
  }
`;

export async function fetchProjectFunctions(): Promise<ProjectFunctionRow[]> {
  const data = await graphqlFetcher<{
    projectFunctionsInfo?: ProjectFunctionRow[] | null;
  }>(LIST_FUNCTIONS)();
  return data.projectFunctionsInfo?.filter(Boolean) ?? [];
}

export type UpsertFunctionInput = {
  name: string;
  description?: string;
  graphqlSchemaType: FunctionGraphQLExposure;
  runtime: "deno" | "wasm";
  source: string;
  update: boolean;
  capabilities?: string[];
};

export async function upsertProjectFunction(
  input: UpsertFunctionInput,
): Promise<ProjectFunctionRow> {
  const data = await graphqlFetcher<
    { upsertFunctionToProject?: ProjectFunctionRow | null },
    Record<string, unknown>
  >(UPSERT_FUNCTION, {
    name: input.name,
    description: input.description,
    graphql_schema_type: input.graphqlSchemaType,
    runtime_config: { runtime: input.runtime, time_out: 15 },
    request: "JSON",
    request_payload_is_optional: true,
    response: "JSON",
    response_is_array: false,
    update: input.update,
    source: input.source,
    trigger_type: "callable",
    language: input.runtime === "deno" ? "typescript" : "wasm",
    capabilities: input.capabilities ?? [],
  })();
  if (!data.upsertFunctionToProject?.name) {
    throw new Error("Function save failed");
  }
  return data.upsertFunctionToProject;
}

export async function deployProjectFunction(
  name: string,
  source?: string,
): Promise<{
  function?: ProjectFunctionRow | null;
  revision?: FunctionRevisionRow | null;
  deployment?: FunctionDeploymentRow | null;
}> {
  const data = await graphqlFetcher<
    {
      deployFunctionToProject?: {
        function?: ProjectFunctionRow | null;
        revision?: FunctionRevisionRow | null;
        deployment?: FunctionDeploymentRow | null;
      } | null;
    },
    { name: string; source?: string }
  >(DEPLOY_FUNCTION, { name, source })();
  if (!data.deployFunctionToProject) {
    throw new Error("Deploy failed");
  }
  return data.deployFunctionToProject;
}

export async function rollbackProjectFunction(
  name: string,
  revisionId: string,
): Promise<void> {
  const data = await graphqlFetcher<
    { rollbackFunctionDeployment?: { function?: ProjectFunctionRow | null } | null },
    { name: string; revision_id: string }
  >(ROLLBACK_FUNCTION, { name, revision_id: revisionId })();
  if (!data.rollbackFunctionDeployment?.function?.name) {
    throw new Error("Rollback failed");
  }
}

export async function testFunctionDraft(input: {
  name: string;
  source?: string;
  payload?: Record<string, unknown>;
  tenantId?: string;
}): Promise<DraftTestResult> {
  const data = await graphqlFetcher<
    { testFunctionDraft?: DraftTestResult | null },
    Record<string, unknown>
  >(TEST_DRAFT, {
    name: input.name,
    source: input.source,
    payload: input.payload ?? {},
    tenant_id: input.tenantId || undefined,
  })();
  if (!data.testFunctionDraft) {
    throw new Error("Draft test failed");
  }
  return data.testFunctionDraft;
}

export async function fetchFunctionRevisions(
  name: string,
): Promise<FunctionRevisionRow[]> {
  const data = await graphqlFetcher<
    { listFunctionRevisions?: FunctionRevisionRow[] | null },
    { name: string; limit: number }
  >(LIST_REVISIONS, { name, limit: 50 })();
  return data.listFunctionRevisions?.filter(Boolean) ?? [];
}

export async function fetchFunctionDeployments(
  name: string,
): Promise<FunctionDeploymentRow[]> {
  const data = await graphqlFetcher<
    { listFunctionDeployments?: FunctionDeploymentRow[] | null },
    { name: string; limit: number }
  >(LIST_DEPLOYMENTS, { name, limit: 50 })();
  return data.listFunctionDeployments?.filter(Boolean) ?? [];
}

export async function deleteProjectFunction(
  functionName: string,
): Promise<void> {
  await graphqlFetcher<
    {
      deleteFunctionFromProject?: Array<{ name?: string | null } | null> | null;
    },
    { function: string }
  >(DELETE_FUNCTION, { function: functionName })();
}

export function restCallableUrl(projectId: string, name: string): string {
  const base =
    ENV.VITE_REST_API?.replace(/\/$/, "") ||
    (typeof window !== "undefined" ? window.location.origin : "http://localhost:4001");
  return `${base}/function/${projectId}/${name}`;
}
