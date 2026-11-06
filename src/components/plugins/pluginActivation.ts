import type { PluginDetailsRow } from "./pluginTypes";

/** Project is on only when enable is true or activate_status is activated. */
export function isProjectPluginActivated(plugin: PluginDetailsRow): boolean {
  const status = String(plugin.activate_status || "").toLowerCase();
  if (status === "deactivated" && plugin.enable !== true) return false;
  return plugin.enable === true || status === "activated";
}
