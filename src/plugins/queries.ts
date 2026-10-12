import type { QueryClient } from "@tanstack/react-query";
import { pluginRegistryKeys } from "../lib/queryKeys";
import pluginRegistry from "./PluginRegistry";

export async function scanPluginRegistry(): Promise<string> {
  await pluginRegistry.scanForPlugins();
  const plugins = pluginRegistry.getState().plugins;
  return Array.from(plugins.keys())
    .filter((name) => plugins.get(name)?.loaded)
    .sort()
    .join(",");
}

export function pluginRegistryScanQuery(projectId: string) {
  return {
    queryKey: pluginRegistryKeys.registry(projectId),
    queryFn: scanPluginRegistry,
  } as const;
}

export function prefetchPluginRegistryScan(
  queryClient: QueryClient,
  projectId = "",
) {
  return queryClient.fetchQuery(pluginRegistryScanQuery(projectId));
}

export async function refreshPluginRegistry(
  queryClient: QueryClient,
  projectId = "",
) {
  pluginRegistry.reset();
  await queryClient.invalidateQueries({ queryKey: pluginRegistryKeys.all });
  return prefetchPluginRegistryScan(queryClient, projectId);
}
