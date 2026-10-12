import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Typography, Card, Button, Row, Col, Spin, Empty, Alert, } from "antd";
import { useGetSystemPluginsQuery, } from "../../../generated_gql/tanstack-query";
import PluginCard from "../../../components/plugins/PluginCard";
import PluginSettingsDrawer from "../../../components/plugins/PluginSettingsDrawer";
import PluginMarketplaceSection from "../../../components/plugins/PluginMarketplaceSection";
const { Title, Text } = Typography;
const PluginsSettingsPage = () => {
    const [selectedPlugin, setSelectedPlugin] = useState(null);
    const [settingsDrawerVisible, setSettingsDrawerVisible] = useState(false);
    const { data, isLoading: loading, error, refetch } = useGetSystemPluginsQuery({ limit: 100, page: 1 });
    const plugins = (data?.getSystemPlugins ?? []).filter(Boolean);
    const installedPlugins = plugins.filter((plugin) => (plugin.load_status || "").toLowerCase() === "installed" ||
        (plugin.load_status || "").toLowerCase() === "loaded");
    const availablePlugins = plugins.filter((plugin) => (plugin.load_status || "").toLowerCase() !== "installed" &&
        (plugin.load_status || "").toLowerCase() !== "loaded");
    const handleSettingsClick = (plugin) => {
        setSelectedPlugin(plugin);
        setSettingsDrawerVisible(true);
    };
    const handleCloseSettings = () => {
        setSettingsDrawerVisible(false);
        setSelectedPlugin(null);
    };
    const handleRefresh = () => {
        refetch();
    };
    if (loading) {
        return (_jsxs("div", { style: { padding: "24px", textAlign: "center" }, children: [_jsx(Spin, { size: "large" }), _jsx("div", { style: { marginTop: "16px" }, children: "Loading plugins..." })] }));
    }
    if (error) {
        return (_jsx("div", { style: { padding: "24px" }, children: _jsx(Alert, { message: "Error Loading Plugins", description: error instanceof Error
                    ? error.message
                    : "Failed to load plugins. Please try again.", type: "error", showIcon: true, action: _jsx(Button, { size: "small", onClick: handleRefresh, children: "Retry" }) }) }));
    }
    return (_jsxs("div", { style: { padding: "16px" }, children: [_jsxs("div", { style: { marginBottom: "24px" }, children: [_jsx(Title, { level: 2, style: { margin: 0 }, children: "System Plugins" }), _jsx(Text, { type: "secondary", children: "Manage and configure system-wide plugins and the catalog" })] }), plugins.length === 0 ? (_jsx(Alert, { type: "info", showIcon: true, message: "No plugins in this list", style: { marginBottom: "24px" }, action: _jsx(Button, { size: "small", onClick: handleRefresh, children: "Refresh" }) })) : null, _jsxs(Card, { style: { marginBottom: "24px" }, children: [_jsxs("div", { style: { marginBottom: "16px" }, children: [_jsxs(Title, { level: 4, style: { margin: 0 }, children: ["Installed Plugins (", installedPlugins.length, ")"] }), _jsx(Text, { type: "secondary", children: "These plugins are currently active in your project" })] }), installedPlugins.length === 0 ? (_jsx(Empty, { description: "No installed plugins" })) : (_jsx(Row, { gutter: [16, 16], children: installedPlugins.map((plugin, index) => (_jsx(Col, { xs: 24, sm: 12, lg: 8, children: _jsx(PluginCard, { plugin: plugin, onSettingsClick: handleSettingsClick }) }, plugin.id || index))) }))] }), availablePlugins.length > 0 ? (_jsxs(Card, { style: { marginBottom: "24px" }, children: [_jsxs("div", { style: { marginBottom: "16px" }, children: [_jsxs(Title, { level: 4, style: { margin: 0 }, children: ["Available Plugins (", availablePlugins.length, ")"] }), _jsx(Text, { type: "secondary", children: "These plugins are available but not yet enabled" })] }), _jsx(Row, { gutter: [16, 16], children: availablePlugins.map((plugin, index) => (_jsx(Col, { xs: 24, sm: 12, lg: 8, children: _jsx(PluginCard, { plugin: plugin, onSettingsClick: handleSettingsClick }) }, plugin.id || index))) })] })) : null, _jsx(PluginMarketplaceSection, { browseDestination: "/plugins" }), _jsx(PluginSettingsDrawer, { open: settingsDrawerVisible, onClose: handleCloseSettings, selectedPlugin: selectedPlugin, variant: "system", onAfterMutation: () => {
                    void refetch();
                } })] }));
};
export default PluginsSettingsPage;
