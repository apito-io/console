export type EnvVarRow = { key?: string | null; value?: string | null };

export function mergePluginEnvVars(
  _pluginId: string | null | undefined,
  existing?: Array<EnvVarRow | null> | null,
  templates?: Array<EnvVarRow | null> | null,
): Array<{ key: string; value: string }> {
  const byKey = new Map<string, string>();
  for (const row of templates ?? []) {
    if (row?.key) {
      byKey.set(row.key, row.value ?? "");
    }
  }
  for (const row of existing ?? []) {
    if (row?.key) {
      byKey.set(row.key, row.value ?? "");
    }
  }
  return Array.from(byKey.entries()).map(([key, value]) => ({ key, value }));
}
