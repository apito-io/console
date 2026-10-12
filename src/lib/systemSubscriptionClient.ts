import { createClient, type Client } from "graphql-ws";
import { resolveGraphqlSubscriptionUri } from "./graphqlFetcher";

export type SystemNotifyPayload = {
  type?: string | null;
  message?: string | null;
  project_id?: string | null;
};

const NOTIFY_SYSTEM_SUBSCRIPTION = `
  subscription NotifySystem {
    notifySystem {
      type
      message
      project_id
    }
  }
`;

let sharedClient: Client | null = null;

export function getSystemSubscriptionClient(): Client {
  if (!sharedClient) {
    sharedClient = createClient({
      url: resolveGraphqlSubscriptionUri(),
      lazy: true,
      retryAttempts: 5,
      shouldRetry: () => true,
      connectionParams: () => ({
        headers: { "X-Use-Cookies": "true" },
      }),
    });
  }
  return sharedClient;
}

export function subscribeNotifySystem(
  onEvent: (payload: SystemNotifyPayload) => void,
  onStatus?: (connected: boolean) => void
): () => void {
  const client = getSystemSubscriptionClient();
  let active = true;

  const dispose = client.subscribe<{ notifySystem?: SystemNotifyPayload }>(
    { query: NOTIFY_SYSTEM_SUBSCRIPTION },
    {
      next: (result) => {
        const payload = result.data?.notifySystem;
        if (payload) {
          onEvent(payload);
        }
      },
      error: () => {
        if (active) {
          onStatus?.(false);
        }
      },
      complete: () => {
        if (active) {
          onStatus?.(false);
        }
      },
    }
  );

  onStatus?.(true);

  return () => {
    active = false;
    onStatus?.(false);
    dispose();
  };
}

/** Engine system event type strings (mirror open-core/models/graphql_subscription.go). */
export const SystemEventType = {
  SchemaExecutionUpdated: "schema_execution_updated",
  SchemaPublishProgress: "schema_publish_progress",
  PluginStatusChanged: "plugin_status_changed",
  ProjectCreated: "project_created",
  ProjectUpdated: "project_updated",
  Info: "info",
} as const;
