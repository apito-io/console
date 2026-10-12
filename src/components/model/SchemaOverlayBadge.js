import { jsx as _jsx } from "react/jsx-runtime";
import { Tag, theme } from "antd";
const SchemaOverlayBadge = ({ kind, draftVersionLabel, }) => {
    const { token } = theme.useToken();
    if (kind === "live") {
        return null;
    }
    if (kind === "removed") {
        return (_jsx(Tag, { color: "error", style: { marginInlineEnd: 0, fontSize: 10 }, children: "Removed" }));
    }
    const label = kind === "added"
        ? draftVersionLabel || "Draft"
        : kind === "modified"
            ? draftVersionLabel
                ? `${draftVersionLabel} · Changed`
                : "Changed"
            : draftVersionLabel || "Draft";
    return (_jsx(Tag, { style: {
            marginInlineEnd: 0,
            fontSize: 10,
            color: token.colorWarning,
            background: token.colorWarningBg,
            borderColor: token.colorWarningBorder,
        }, children: label }));
};
export function schemaOverlaySurfaceStyle(kind, token) {
    if (kind === "added" || kind === "modified") {
        return {
            background: token.colorWarningBg,
            borderColor: token.colorWarningBorder,
        };
    }
    if (kind === "removed") {
        return {
            background: token.colorErrorBg,
            borderColor: token.colorErrorBorder,
            opacity: 0.85,
        };
    }
    return undefined;
}
export function schemaOverlayTextStyle(kind) {
    if (kind === "removed") {
        return { textDecoration: "line-through" };
    }
    return undefined;
}
export default SchemaOverlayBadge;
