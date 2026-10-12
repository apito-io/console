import { print } from "graphql";
import { ENV } from "../utils/env";
import { performAuthFailureRedirect } from "../services/httpService";

const DEFAULT_URI =
  typeof import.meta !== "undefined" && import.meta.env?.VITE_GRAPHQL_URL
    ? import.meta.env.VITE_GRAPHQL_URL
    : "";

function resolveGraphqlUri() {
  if (ENV.VITE_GRAPH_API) return ENV.VITE_GRAPH_API;
  if (DEFAULT_URI) return DEFAULT_URI;
  if (typeof window !== "undefined") {
    return window.location.origin + "/system/graphql";
  }
  return "http://localhost:5051/system/graphql";
}

/** WebSocket URL for system operator subscriptions (notifySystem). */
export function resolveGraphqlSubscriptionUri() {
  const http = resolveGraphqlUri();
  const url = new URL(
    http,
    typeof window !== "undefined" ? window.location.origin : undefined,
  );
  url.protocol = url.protocol === "https:" ? "wss:" : "ws:";
  if (url.pathname.endsWith("/graphql")) {
    url.pathname = url.pathname.replace(/\/graphql\/?$/, "/graphql/subscription");
  } else if (!url.pathname.includes("/graphql/subscription")) {
    url.pathname = url.pathname.replace(/\/?$/, "/system/graphql/subscription");
  }
  return url.toString();
}

function toQueryString(query) {
  if (typeof query === "string") {
    return query;
  }
  // graphql-tag DocumentNode: `.toString()` is "[object Object]" — must print AST.
  if (query && typeof query === "object" && query.kind === "Document") {
    return print(query);
  }
  const body = query?.loc?.source?.body;
  if (typeof body === "string" && body.length > 0) {
    return body;
  }
  return query.toString();
}

/**
 * GraphQL fetcher for codegen TanStack Query hooks.
 * Replaces Apollo link stack (credentials, X-Use-Cookies, auth redirect).
 */
export function graphqlFetcher(query, variables, headers) {
  const queryString = toQueryString(query);
  return async () => {
    const res = await fetch(resolveGraphqlUri(), {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "X-Use-Cookies": "true",
        ...(headers ?? {}),
      },
      body: JSON.stringify({ query: queryString, variables }),
    });
    if (res.status === 401 || res.status === 403) {
      performAuthFailureRedirect();
      throw new Error("Unauthorized");
    }
    const json = await res.json();
    if (json.errors?.length) {
      throw new Error(json.errors[0]?.message ?? "GraphQL request failed");
    }
    if (json.data === undefined) {
      throw new Error("GraphQL response missing data");
    }
    return json.data;
  };
}
