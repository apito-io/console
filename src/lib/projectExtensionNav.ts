import { useMemo } from "react";
import type { ReactNode } from "react";
import {
  useNavigationExtension,
  type NavExtensionItem,
} from "../contexts/NavigationExtensionContext";
import type { ProjectExtensionNavItem } from "../constants/projectNavigation";

function toExtensionItem(item: NavExtensionItem): ProjectExtensionNavItem | null {
  if (!item || typeof item !== "object" || !("key" in item)) {
    return null;
  }

  const label =
    typeof item.label === "string"
      ? item.label
      : String(item.key ?? "Menu");

  return {
    key: String(item.key),
    label,
    path: "#",
    icon: "icon" in item ? (item.icon as ReactNode) : undefined,
    onClick:
      "onClick" in item && typeof item.onClick === "function"
        ? item.onClick
        : undefined,
  };
}

export function useProjectExtensionNavItems(): ProjectExtensionNavItem[] {
  const { extensionItems, beforeAnchorItems } = useNavigationExtension();

  return useMemo(() => {
    const beforeSupport = beforeAnchorItems
      .filter((entry) => entry.anchorKey === "support")
      .flatMap((entry) => entry.items);

    const merged = [...extensionItems, ...beforeSupport];
    return merged
      .map(toExtensionItem)
      .filter((item): item is ProjectExtensionNavItem => item !== null);
  }, [beforeAnchorItems, extensionItems]);
}
