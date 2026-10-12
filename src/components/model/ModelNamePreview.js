import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Space, Tag, Typography } from "antd";
import { camelFromCanonical, canonicalizeModelName, pascalFromCanonical, } from "../../utils/apitoNaming";
const ModelNamePreview = ({ rawName }) => {
    if (!rawName || typeof rawName !== "string")
        return null;
    try {
        const canonical = canonicalizeModelName(rawName);
        const singularQuery = camelFromCanonical(canonical);
        const listQuery = `${singularQuery}List`;
        const pascalName = pascalFromCanonical(canonical);
        const createMutation = `create${pascalName}`;
        const updateMutation = `update${pascalName}`;
        const deleteMutation = `delete${pascalName}`;
        return (_jsxs(Space, { direction: "vertical", size: 8, style: { width: "100%" }, children: [_jsxs(Space, { size: 8, wrap: true, children: [_jsx(Typography.Text, { strong: true, children: "Canonical id" }), _jsx(Tag, { children: canonical })] }), _jsxs(Space, { size: 8, wrap: true, children: [_jsx(Typography.Text, { strong: true, children: "GraphQL" }), _jsx(Tag, { children: `Query: ${singularQuery}, ${listQuery}` }), _jsx(Tag, { children: `Mutation: ${createMutation}, ${updateMutation}, ${deleteMutation}` })] })] }));
    }
    catch {
        return null;
    }
};
export default ModelNamePreview;
