import { pluginRegistryKeys } from "../lib/queryKeys";
import pluginRegistry from "./PluginRegistry";
/**
 * Runs plugin discovery once; result is cached under `pluginRegistryKeys.registry()`
 * so other hooks can observe the same scan without duplicate work.
 */
export async function scanPluginRegistry() {
    await pluginRegistry.scanForPlugins();
    const plugins = pluginRegistry.getState().plugins;
    return Array.from(plugins.keys())
        .filter((name) => plugins.get(name)?.loaded)
        .sort()
        .join(",");
}
export const pluginRegistryScanQuery = {
    queryKey: pluginRegistryKeys.registry(),
    queryFn: scanPluginRegistry,
};
export function prefetchPluginRegistryScan(queryClient) {
    return queryClient.fetchQuery(pluginRegistryScanQuery);
}
