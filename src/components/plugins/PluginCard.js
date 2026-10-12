import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Card, Typography, Tag, Avatar } from "antd";
const { Title, Text } = Typography;
const getStatusColor = (status) => {
    if (!status)
        return "default";
    const statusLower = status.toLowerCase();
    switch (statusLower) {
        case "loaded":
        case "installed":
            return "success";
        case "error":
        case "failed":
            return "error";
        case "loading":
        case "installing":
            return "processing";
        case "not_installed":
            return "default";
        default:
            return "default";
    }
};
const getStatusText = (status) => {
    if (!status)
        return "Unknown";
    return status
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(" ");
};
const getInitials = (text) => {
    if (!text)
        return "?";
    return text.charAt(0).toUpperCase();
};
const PluginCard = ({ plugin, onSettingsClick }) => {
    if (!plugin) {
        return null;
    }
    const pluginName = plugin.title || plugin.id || "Unnamed Plugin";
    const pluginIcon = plugin.icon;
    return (_jsx(Card, { hoverable: true, style: {
            height: "100%",
            cursor: "pointer",
            transition: "all 0.3s ease",
        }, onClick: () => onSettingsClick(plugin), styles: { body: { padding: "20px" } }, children: _jsxs("div", { style: { display: "flex", flexDirection: "column", gap: "12px" }, children: [_jsxs("div", { style: {
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "12px",
                    }, children: [pluginIcon ? (_jsx(Avatar, { src: pluginIcon, size: 48, style: {
                                flexShrink: 0,
                                backgroundColor: "#f0f0f0",
                            }, children: getInitials(pluginName) })) : (_jsx(Avatar, { size: 48, style: {
                                flexShrink: 0,
                                backgroundColor: "#1890ff",
                                color: "#fff",
                                fontSize: "20px",
                                fontWeight: 600,
                            }, children: getInitials(pluginName) })), _jsxs("div", { style: { flex: 1, minWidth: 0 }, children: [_jsxs("div", { style: {
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "8px",
                                        marginBottom: "4px",
                                    }, children: [_jsx(Title, { level: 5, style: {
                                                margin: 0,
                                                fontSize: "16px",
                                                fontWeight: 600,
                                                lineHeight: "1.4",
                                            }, children: pluginName }), plugin.load_status && (_jsx(Tag, { color: getStatusColor(plugin.load_status), style: { margin: 0 }, children: getStatusText(plugin.load_status) }))] }), plugin.version && (_jsxs(Text, { type: "secondary", style: {
                                        fontSize: "13px",
                                        display: "block",
                                        lineHeight: "1.4",
                                    }, children: ["v", plugin.version, plugin.author && ` • by ${plugin.author}`] }))] })] }), plugin.description && (_jsx(Text, { style: {
                        fontSize: "13px",
                        lineHeight: "1.6",
                        color: "#595959",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                    }, children: plugin.description })), _jsxs("div", { style: {
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "6px",
                        marginTop: "4px",
                    }, children: [plugin.type && (_jsx(Tag, { color: "blue", style: { margin: 0 }, children: plugin.type })), plugin.enable !== null && plugin.enable !== undefined && (_jsx(Tag, { color: plugin.enable ? "green" : "default", style: { margin: 0 }, children: plugin.enable ? "Enabled" : "Disabled" })), plugin.role && (_jsx(Tag, { color: "orange", style: { margin: 0 }, children: plugin.role }))] })] }) }));
};
export default PluginCard;
