import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Divider, Tooltip, Typography } from "antd";
import { Field_Type_Enum } from "../../generated_gql/tanstack-query";
import { generateIcon } from "../../utils/generateLabelAndIcon";
import "./SingleFieldOption.css";
const { Text } = Typography;
const SingleFieldOption = ({ fieldOption, onSelectField, index, }) => {
    // Create a temporary field info object for generateIcon
    const fieldInfo = {
        field_type: fieldOption.field_type === "relation" ? "text" : fieldOption.field_type,
        field_sub_type: fieldOption.field_sub_type,
        input_type: fieldOption.input_type,
    };
    return (_jsxs("div", { children: [fieldOption.field_type === "relation" ? (_jsx(Divider, { orientation: "right", children: "Special Fields" })) : null, fieldOption.field_type === Field_Type_Enum.Text ? (_jsx(Divider, { orientation: "right", children: "Regular Fields" })) : null, _jsx("div", { className: "single-field-option-container", onClick: () => onSelectField(index), children: _jsx(Tooltip, { title: _jsxs("div", { children: [_jsx("strong", { children: fieldOption.label }), _jsx("br", {}), fieldOption.description, _jsx("br", {}), _jsx("pre", { style: { fontSize: "11px", marginTop: "8px" }, children: JSON.stringify(fieldOption.example_json, null, 2) })] }), color: "rgba(0, 0, 0, 0.85)", placement: "left", children: _jsxs("div", { className: "field-option-content", children: [_jsx("div", { className: "field-option-icon", children: generateIcon(fieldInfo) }), _jsxs("div", { className: "field-option-text", children: [_jsx(Text, { className: "field-option-title", children: fieldOption.label }), _jsx(Text, { className: "field-option-description", children: fieldOption.description })] })] }) }) })] }));
};
export default SingleFieldOption;
