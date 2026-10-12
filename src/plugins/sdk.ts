import React from "react";
import * as antd from "antd";
import { message } from "antd";
import type { PluginConfig } from "./types";
import pluginRegistry from "./PluginRegistry";
import { getRestUrl } from "../constants/api";

export const APITO_PLUGIN_SDK_VERSION = "1.0.0";

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
  notify: typeof message;
};

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
