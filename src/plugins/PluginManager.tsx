import React, { useEffect, useState } from "react";
import type { ErrorInfo } from "react";
import type { PluginRegistryState, PluginManagerAPI } from "./types";
import pluginRegistry from "./PluginRegistry";

// Error Boundary for Plugin System
class PluginErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(
      "[Plugin System] Error caught by boundary:",
      error,
      errorInfo
    );
  }

  render() {
    if (this.state.hasError) {
      console.warn(
        "[Plugin System] Plugin system failed, continuing without plugins"
      );
      return this.props.children;
    }
    return this.props.children;
  }
}

// Custom hook for plugin state
export const usePluginManager = (): [PluginRegistryState, PluginManagerAPI] => {
  const [state, setState] = useState<PluginRegistryState>(
    pluginRegistry.getState()
  );

  useEffect(() => {
    const unsubscribe = pluginRegistry.subscribe(setState);
    return unsubscribe;
  }, []);

  const api: PluginManagerAPI = {
    async loadPlugin(pluginPath: string) {
      try {
        await pluginRegistry.loadPlugin(pluginPath);
      } catch (error) {
        console.error("Failed to load plugin:", error);
        // Don't throw - continue gracefully
      }
    },

    getPlugin(name: string) {
      try {
        return pluginRegistry.getState().plugins.get(name);
      } catch (error) {
        console.error("Failed to get plugin:", error);
        return undefined;
      }
    },

    getPluginRoutes() {
      try {
        const plugins = Array.from(pluginRegistry.getState().plugins.values());
        const routes: Array<{
          path: string;
          pluginName: string;
          component: string;
        }> = [];

        plugins.forEach((plugin) => {
          if (plugin.config.routes) {
            plugin.config.routes.forEach((route) => {
              routes.push({
                ...route,
                path: `/console/plugin/${plugin.config.name}${route.path}`,
                pluginName: plugin.config.name,
                component: route.component,
              });
            });
          }
        });

        return routes;
      } catch (error) {
        console.error("Failed to get plugin routes:", error);
        return [];
      }
    },

    getPluginMenuItems() {
      try {
        const plugins = Array.from(pluginRegistry.getState().plugins.values());
        return plugins
          .filter((plugin) => plugin.config.menu)
          .map((plugin) => ({
            label: plugin.config.menu!.label,
            path:
              plugin.config.menu!.path ||
              `/console/plugin/${plugin.config.name}`,
            icon: plugin.config.menu!.icon,
          }));
      } catch (error) {
        console.error("Failed to get plugin menu items:", error);
        return [];
      }
    },

    getPluginSettingsItems() {
      try {
        const plugins = Array.from(pluginRegistry.getState().plugins.values());
        return plugins
          .filter((plugin) => plugin.config.settings?.menu)
          .map((plugin) => ({
            label: plugin.config.settings!.menu!.label,
            path:
              plugin.config.settings!.menu!.path ||
              `/console/settings/plugins/${plugin.config.name}`,
            icon: plugin.config.settings!.menu!.icon,
            section: plugin.config.settings!.section || "general",
            pluginName: plugin.config.name,
          }));
      } catch (error) {
        console.error("Failed to get plugin settings items:", error);
        return [];
      }
    },

    getPluginFields() {
      try {
        const plugins = Array.from(pluginRegistry.getState().plugins.values());
        const fields: Array<{
          type: string;
          label: string;
          description?: string;
          icon?: string;
          category?: string;
          properties?: Record<string, unknown>;
          formComponent: string;
          displayComponent?: string;
        }> = [];

        plugins.forEach((plugin) => {
          if (plugin.config.fields && plugin.loaded) {
            fields.push(...plugin.config.fields);
          }
        });

        return fields;
      } catch (error) {
        console.error("Failed to get plugin fields:", error);
        return [];
      }
    },

    getPluginComponent(
      pluginName: string,
      componentType: "menu" | "settings" | "fields" | "forms",
      componentName: string
    ) {
      try {
        const plugin = pluginRegistry.getState().plugins.get(pluginName);
        if (!plugin || !plugin.loaded || !plugin.config.components) {
          return undefined;
        }

        const componentRegistry = plugin.config.components[componentType];
        if (!componentRegistry) {
          return undefined;
        }

        return componentRegistry[componentName];
      } catch (error) {
        console.error("Failed to get plugin component:", error);
        return undefined;
      }
    },
  };

  return [state, api];
};

// Plugin Manager Provider Component
export const PluginManagerProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [, api] = usePluginManager();

  useEffect(() => {
    // Wait for React to be available before initializing plugins
    const waitForReact = (): Promise<void> => {
      return new Promise((resolve) => {
        const checkReact = () => {
          if (typeof window !== "undefined" && window.React) {
            console.log(
              "[Plugin System] React is available, proceeding with plugin discovery"
            );
            resolve();
          } else {
            console.log("[Plugin System] Waiting for React to be available...");
            setTimeout(checkReact, 100);
          }
        };
        checkReact();
      });
    };

    // Initialize plugin scanning on mount with error handling
    const initializePlugins = async () => {
      try {
        // Wait for React to be ready first
        await waitForReact();
        console.log("[Plugin System] Starting plugin discovery...");
        await pluginRegistry.scanForPlugins();
        console.log("[Plugin System] Plugin discovery completed");
      } catch (error) {
        console.warn(
          "[Plugin System] Plugin initialization failed, continuing without plugins:",
          error
        );
      }
    };

    initializePlugins();
  }, []);

  // Make API available globally for plugins
  useEffect(() => {
    if (typeof window !== "undefined") {
      (window as unknown as { PluginAPI?: unknown }).PluginAPI = api;
    }
  }, [api]);

  return <PluginErrorBoundary>{children}</PluginErrorBoundary>;
};

// Plugin Container Component with Error Handling
export const PluginContainer: React.FC<{
  pluginName: string;
  routePath: string;
  fallback?: React.ReactNode;
}> = ({ pluginName, routePath, fallback }) => {
  const [, api] = usePluginManager();
  const [component, setComponent] = useState<React.ComponentType | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadComponent = () => {
      try {
        const plugin = api.getPlugin(pluginName);
        if (!plugin) {
          setError(`Plugin ${pluginName} not found`);
          return;
        }

        // Find the matching route
        const route = plugin.config.routes?.find((r) => r.path === routePath);
        if (!route) {
          setError(`Route ${routePath} not found in plugin ${pluginName}`);
          return;
        }

        // Get component from global registry
        const windowWithRegistry = window as unknown as {
          PluginRegistry?: Record<string, unknown>;
        };
        if (
          typeof window !== "undefined" &&
          windowWithRegistry.PluginRegistry
        ) {
          const globalPlugin = windowWithRegistry.PluginRegistry[pluginName];
          if (globalPlugin && typeof globalPlugin === "object") {
            const pluginObj = globalPlugin as {
              components?: Record<string, React.ComponentType>;
            };
            if (pluginObj.components && pluginObj.components[route.component]) {
              setComponent(() => pluginObj.components![route.component]);
              setError(null);
            } else {
              setError(`Component ${route.component} not found`);
            }
          } else {
            setError("Plugin registry not available");
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      }
    };

    loadComponent();
  }, [pluginName, routePath, api]);

  if (error) {
    return (
      fallback || (
        <div style={{ padding: "24px", textAlign: "center", color: "#ff4d4f" }}>
          <h3>Plugin Error</h3>
          <p>{error}</p>
        </div>
      )
    );
  }

  if (!component) {
    return (
      <div style={{ padding: "24px", textAlign: "center" }}>
        <p>Loading plugin component...</p>
      </div>
    );
  }

  const Component = component;
  return (
    <PluginErrorBoundary>
      <Component />
    </PluginErrorBoundary>
  );
};

export default {
  usePluginManager,
  PluginManagerProvider,
  PluginContainer,
};
