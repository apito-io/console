import React, { Suspense } from "react";
import type { ErrorInfo } from "react";
import { useParams } from "../router/navigation";
import { usePluginManager } from "./PluginManager";
import type { LoadedPlugin, PluginRoute } from "./types";
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
function pluginSplatToRoute(splat?: string): string {
  if (!splat || splat === "/") return "/";
  return splat.startsWith("/") ? splat : `/${splat}`;
}

export const PluginRouter: React.FC = () => {
  const params = useParams<{
    pluginName?: string;
    _splat?: string;
    "*": string;
  }>();
  const pluginName = params.pluginName;
  const route = pluginSplatToRoute(params._splat ?? params["*"]);
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

  const currentRoute = route || "/";
  const matchingRoute = plugin.config.routes?.find((r: PluginRoute) => {
    if (r.path === "/") return currentRoute === "/";
    return currentRoute.startsWith(r.path);
  });

  const ComponentToRender = resolvePluginPage(plugin, matchingRoute?.component);

  if (ComponentToRender && !plugin.config.blockedReason) {
    return (
      <PluginComponentErrorBoundary pluginName={pluginName}>
        <Suspense fallback={<PluginLoadingFallback pluginName={pluginName} />}>
          <div className="plugin-container" data-plugin={pluginName}>
            <ComponentToRender />
          </div>
        </Suspense>
      </PluginComponentErrorBoundary>
    );
  }

  if (!matchingRoute || plugin.config.declarative || plugin.config.blockedReason) {
    return (
      <Result
        status={plugin.config.blockedReason ? "warning" : "info"}
        title={plugin.config.displayName || pluginName}
        subTitle={
          plugin.config.blockedReason ||
          "This plugin has no signed Console bundle. Open Project Settings → Plugins to configure it."
        }
      />
    );
  }

  return (
    <Result
      status="error"
      title="Component Not Found"
      subTitle={`The component "${matchingRoute.component}" was not found in the ${pluginName} plugin.`}
    />
  );
};

function resolvePluginPage(
  plugin: LoadedPlugin,
  componentName?: string,
): React.ComponentType | null {
  if (!componentName || componentName === "Page") {
    const only = Object.values(plugin.config.components?.pages || {});
    return only.length === 1 ? only[0] : null;
  }
  const pages = plugin.config.components?.pages;
  if (pages?.[componentName]) {
    return pages[componentName];
  }
  const forms = plugin.config.components?.forms;
  if (forms?.[componentName]) {
    return forms[componentName];
  }
  return null;
}

export default PluginRouter;
