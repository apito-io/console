import React from "react";
import * as antd from "antd";
import { message } from "antd";
import type { PluginConfig } from "./types";
import pluginRegistry from "./PluginRegistry";
import { getRestUrl, SYSTEM_GRAPHQL_URL } from "../constants/api";

export const APITO_PLUGIN_SDK_VERSION = "1.1.0";

export type PluginRestClient = {
  get: (path: string, init?: RequestInit) => Promise<unknown>;
  post: (path: string, body?: unknown, init?: RequestInit) => Promise<unknown>;
};

function pluginFetch(pluginId: string, path: string, init?: RequestInit) {
  const projectId =
    typeof window !== "undefined"
      ? window.ApitoPluginSDK?.projectId() ?? ""
      : "";
  const url = getRestUrl(`/plugin/${pluginId}${path}`);
  const sep = url.includes("?") ? "&" : "?";
  const withProject = projectId
    ? `${url}${sep}project_id=${encodeURIComponent(projectId)}`
    : url;
  return fetch(withProject, {
    credentials: "include",
    ...init,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-Use-Cookies": "true",
      ...(projectId ? { "X-Apito-Project-ID": projectId } : {}),
      ...(init?.headers as Record<string, string> | undefined),
    },
  }).then(async (res) => {
    const body = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error((body as { error?: string }).error || `HTTP ${res.status}`);
    }
    return body;
  });
}

export type ApitoPluginSDK = {
  version: string;
  register: (config: PluginConfig) => void;
  projectId: () => string;
  rest: (pluginId: string) => PluginRestClient;
  url: (path: string) => string;
  saveProjectEnv: (pluginId: string, env: Record<string, string>) => Promise<void>;
  notify: typeof message;
};

async function saveProjectEnv(pluginId: string, env: Record<string, string>) {
  const env_vars = Object.entries(env).map(([key, value]) => ({ key, value }));
  const projectId = projectIdReader();
  const res = await fetch(SYSTEM_GRAPHQL_URL, {
    method: "POST",
    credentials: "include",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-Use-Cookies": "true",
      ...(projectId ? { "X-Apito-Project-ID": projectId } : {}),
    },
    body: JSON.stringify({
      query:
        "mutation($id: String!, $env_vars: [PluginConfigEnvVarsPayload]) { upsertPlugin(id: $id, env_vars: $env_vars, enable: true) { id enable } }",
      variables: { id: pluginId, env_vars },
    }),
  });
  const body = (await res.json().catch(() => ({}))) as {
    errors?: Array<{ message?: string }>;
  };
  if (!res.ok || (body.errors && body.errors.length > 0)) {
    throw new Error(body.errors?.[0]?.message || `HTTP ${res.status}`);
  }
}

let projectIdReader: () => string = () => "";

export function setPluginSDKProjectIdReader(reader: () => string) {
  projectIdReader = reader;
}

export function installPluginSDK() {
  if (typeof window === "undefined") {
    return;
  }
  const sdk: ApitoPluginSDK = {
    version: APITO_PLUGIN_SDK_VERSION,
    register: (config) => pluginRegistry.registerPlugin(config),
    projectId: () => projectIdReader(),
    rest: (pluginId) => ({
      get: (path, init) => pluginFetch(pluginId, path, init),
      post: (path, body, init) =>
        pluginFetch(pluginId, path, {
          ...init,
          method: "POST",
          body: body === undefined ? undefined : JSON.stringify(body),
        }),
    }),
    url: (path) => getRestUrl(path),
    saveProjectEnv,
    notify: message,
  };
  window.ApitoPluginSDK = sdk;
  window.PluginRegistry = {
    registerPlugin: (config) => pluginRegistry.registerPlugin(config),
    getPlugin: (name) => pluginRegistry.getPlugin(name),
  };
  // Must be the same React/antd instance the console bundled. CDN copies in
  // open-core/index.html make antd Upload click handlers no-op.
  window.React = React;
  window.antd = antd;
}

declare global {
  interface Window {
    React?: typeof React;
    antd?: unknown;
    ApitoPluginSDK?: ApitoPluginSDK;
    PluginRegistry?: {
      registerPlugin: (config: PluginConfig) => void;
      getPlugin?: (name: string) => unknown;
    };
  }
}
