import { createClient } from "graphql-ws";
import { resolveGraphqlSubscriptionUri } from "./graphqlFetcher";
const NOTIFY_SYSTEM_SUBSCRIPTION = `
  subscription NotifySystem {
    notifySystem {
      type
      message
      project_id
    }
  }
`;
let sharedClient = null;
export function getSystemSubscriptionClient() {
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
export function subscribeNotifySystem(onEvent, onStatus) {
    const client = getSystemSubscriptionClient();
    let active = true;
    const dispose = client.subscribe({ query: NOTIFY_SYSTEM_SUBSCRIPTION }, {
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
    });
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
    PluginStatusChanged: "plugin_status_changed",
    ProjectCreated: "project_created",
    ProjectUpdated: "project_updated",
    Info: "info",
};
