import React, { Suspense } from "react";
import type { ErrorInfo } from "react";
import { useParams } from "react-router-dom";
import { usePluginManager } from "./PluginManager";
import type { PluginRoute } from "./types";
import { Spin, Result, Alert } from "antd";

// Error Boundary for individual plugin components
class PluginComponentErrorBoundary extends React.Component<
  { children: React.ReactNode; pluginName: string },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode; pluginName: string }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(`[Plugin Error] ${this.props.pluginName}:`, error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Result
          status="error"
          title="Plugin Error"
          subTitle={`The ${this.props.pluginName} plugin encountered an error and could not be loaded.`}
          extra={
            <Alert
              message="Error Details"
              description={this.state.error?.message || "Unknown error"}
              type="error"
              showIcon
            />
          }
        />
      );
    }

    return this.props.children;
  }
}

// Loading fallback component
const PluginLoadingFallback: React.FC<{ pluginName: string }> = ({
  pluginName,
}) => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "200px",
      flexDirection: "column",
      gap: "16px",
    }}
  >
    <Spin size="large" />
    <div>Loading {pluginName} plugin...</div>
  </div>
);

// Plugin not found component
const PluginNotFound: React.FC<{ pluginName: string }> = ({ pluginName }) => (
  <Result
    status="404"
    title="Plugin Not Found"
    subTitle={`The plugin "${pluginName}" was not found or failed to load.`}
    extra={
      <Alert
        message="Plugin Unavailable"
        description="This plugin may not be installed, enabled, or may have failed to load properly."
        type="warning"
        showIcon
      />
    }
  />
);

// Plugin Router Component
export const PluginRouter: React.FC = () => {
  const { pluginName, "*": route } = useParams();
  const [{ plugins, loading, error }] = usePluginManager();

  // Show loading state
  if (loading) {
    return <PluginLoadingFallback pluginName={pluginName || "Unknown"} />;
  }

  // Show error state
  if (error) {
    return (
      <Result
        status="error"
        title="Plugin System Error"
        subTitle="The plugin system encountered an error."
        extra={
          <Alert
            message="System Error"
            description={error}
            type="error"
            showIcon
          />
        }
      />
    );
  }

  // Plugin name is required
  if (!pluginName) {
    return (
      <Result
        status="404"
        title="No Plugin Specified"
        subTitle="Please specify a plugin to load."
      />
    );
  }

  // Find the plugin
  const plugin = plugins.get(pluginName);

  if (!plugin) {
    return <PluginNotFound pluginName={pluginName} />;
  }

  // Find matching route
  const currentRoute = route || "/";
  const matchingRoute = plugin.config.routes?.find((r: PluginRoute) => {
    if (r.path === "/") return currentRoute === "/";
    return currentRoute.startsWith(r.path);
  });

  if (!matchingRoute) {
    return (
      <Result
        status="404"
        title="Route Not Found"
        subTitle={`The route "${currentRoute}" was not found in the ${pluginName} plugin.`}
      />
    );
  }

  // Get the component
  const ComponentToRender = getPluginComponent(
    pluginName,
    matchingRoute.component
  );

  if (!ComponentToRender) {
    return (
      <Result
        status="error"
        title="Component Not Found"
        subTitle={`The component "${matchingRoute.component}" was not found in the ${pluginName} plugin.`}
      />
    );
  }

  // Render the component with error boundary and suspense
  return (
    <PluginComponentErrorBoundary pluginName={pluginName}>
      <Suspense fallback={<PluginLoadingFallback pluginName={pluginName} />}>
        <div className="plugin-container" data-plugin={pluginName}>
          <ComponentToRender />
        </div>
      </Suspense>
    </PluginComponentErrorBoundary>
  );
};

// Safe component retrieval with error handling
function getPluginComponent(
  pluginName: string,
  componentName: string
): React.ComponentType | null {
  try {
    if (typeof window === "undefined") {
      return null;
    }

    // Method 1: Try to get components from the window global set by the plugin
    const globalComponentsKey = `Plugin_${pluginName}_Components`;
    const windowWithPlugins = window as unknown as Record<string, unknown>;
    const globalComponents = windowWithPlugins[globalComponentsKey];

    if (globalComponents && typeof globalComponents === "object") {
      const componentsObj = globalComponents as Record<string, unknown>;
      const component = componentsObj[componentName];
      if (component && typeof component === "function") {
        console.log(
          `[PluginRouter] Found component ${componentName} in global ${globalComponentsKey}`
        );
        return component as React.ComponentType;
      }
    }

    // Method 2: Try to get components from the PluginRegistry
    const windowWithRegistry = window as unknown as {
      PluginRegistry?: { getPlugin: (name: string) => unknown };
    };
    const pluginRegistry = windowWithRegistry.PluginRegistry;
    if (pluginRegistry && typeof pluginRegistry.getPlugin === "function") {
      const plugin = pluginRegistry.getPlugin(pluginName);
      if (plugin && typeof plugin === "object") {
        const pluginObj = plugin as {
          config?: {
            components?: Record<string, unknown>;
          };
        };
        if (pluginObj.config && pluginObj.config.components) {
          const component = pluginObj.config.components[componentName];
          if (component && typeof component === "function") {
            console.log(
              `[PluginRouter] Found component ${componentName} in PluginRegistry`
            );
            return component as React.ComponentType;
          }
        }
      }
    }

    // Debug: Show what's actually available
    console.warn(
      `[PluginRouter] Component ${componentName} not found in plugin ${pluginName}`
    );
    console.log("[PluginRouter] Debug - Available globals:", {
      [`Plugin_${pluginName}_Components`]:
        !!windowWithPlugins[`Plugin_${pluginName}_Components`],
      PluginRegistry: !!windowWithRegistry.PluginRegistry,
      pluginInRegistry: pluginRegistry
        ? !!pluginRegistry.getPlugin(pluginName)
        : false,
    });

    // Debug: Show what plugin registry contains
    if (pluginRegistry) {
      const plugin = pluginRegistry.getPlugin(pluginName);
      if (plugin && typeof plugin === "object") {
        const pluginObj = plugin as {
          config?: {
            components?: Record<string, unknown>;
          };
          components?: Record<string, unknown>;
        };

        console.log("[PluginRouter] Debug - Plugin in registry:", plugin);
        console.log("[PluginRouter] Debug - Plugin config:", pluginObj.config);
        console.log(
          "[PluginRouter] Debug - Plugin components:",
          pluginObj.config?.components
        );

        // Also check if components are directly on the plugin object
        if (pluginObj.components) {
          console.log(
            "[PluginRouter] Debug - Direct plugin components:",
            pluginObj.components
          );
        }

        // List all available properties
        console.log("[PluginRouter] Debug - Plugin keys:", Object.keys(plugin));
        if (pluginObj.config) {
          console.log(
            "[PluginRouter] Debug - Config keys:",
            Object.keys(pluginObj.config)
          );
        }
      }
    }

    return null;
  } catch (error) {
    console.error(
      `[PluginRouter] Error retrieving component ${componentName} from plugin ${pluginName}:`,
      error
    );
    return null;
  }
}

export default PluginRouter;
