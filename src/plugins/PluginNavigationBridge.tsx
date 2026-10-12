import React, { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "../router/navigation";
import { useNavigationExtension } from "../contexts/NavigationExtensionContext";
import type { NavExtensionItem } from "../contexts/NavigationExtensionContext";
import pluginRegistry from "./PluginRegistry";
import { pluginRegistryScanQuery } from "./queries";
import { LayoutGrid } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

const SOURCE = "plugins";

export const PluginNavigationBridge = () => {
  const navigate = useNavigate();
  const { register, unregister } = useNavigationExtension();
  const { decodeTokenData } = useAuth();
  const projectId = decodeTokenData()?.project_id ?? "";

  useQuery({
    ...pluginRegistryScanQuery(projectId),
    staleTime: 30_000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    enabled: false,
  });

  useEffect(() => {
    const buildItems = (): NavExtensionItem[] => {
      const plugins = Array.from(pluginRegistry.getState().plugins.values());
      return plugins
        .filter((p) => p.loaded && p.config.menu && !p.config.blockedReason)
        .map((plugin) => {
          const menu = plugin.config.menu!;
          const path = menu.path || `/console/plugin/${plugin.config.name}`;
          const iconRaw = menu.icon;
          return {
            key: `plugin-nav-${plugin.config.name}`,
            icon:
              typeof iconRaw === "string" ? (
                <LayoutGrid size={16} strokeWidth={1.75} />
              ) : undefined,
            label: menu.label,
            onClick: () => navigate(path),
          } satisfies NavExtensionItem;
        });
    };

    const sync = () => {
      register(SOURCE, buildItems());
    };

    sync();
    const unsub = pluginRegistry.subscribe(sync);
    return () => {
      unsub();
      unregister(SOURCE);
    };
  }, [navigate, register, unregister, projectId]);

  return null;
};
