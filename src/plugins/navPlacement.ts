import type { PluginNavPlacement } from "./contributions";

export type PlaceableNavItem<T extends { key: string }> = T & {
  placement?: PluginNavPlacement;
};

export function insertByPlacement<T extends { key: string }>(
  core: T[],
  extras: PlaceableNavItem<T>[],
): T[] {
  const out: T[] = [...core];
  const unplaced: T[] = [];
  for (const extra of extras) {
    const placement = extra.placement;
    if (placement?.hidden || placement?.settings) {
      continue;
    }
    if (placement?.after) {
      const idx = out.findIndex((item) => item.key === placement.after);
      if (idx >= 0) {
        out.splice(idx + 1, 0, extra);
        continue;
      }
    }
    if (placement?.before) {
      const idx = out.findIndex((item) => item.key === placement.before);
      if (idx >= 0) {
        out.splice(idx, 0, extra);
        continue;
      }
    }
    unplaced.push(extra);
  }
  return [...out, ...unplaced];
}
