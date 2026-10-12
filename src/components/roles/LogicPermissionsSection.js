import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Checkbox, Typography, Space } from "antd";
const { Title } = Typography;
// const { Group } = Checkbox; // Removed unused Group
const LogicPermissionsSection = ({ functions, value = [], onChange, disabled = false, }) => {
    const handleChange = (checkedValues) => {
        onChange?.(checkedValues);
    };
    return (_jsxs("div", { style: { marginBottom: 24 }, children: [_jsx(Title, { level: 5, style: { marginBottom: 16 }, children: "Logic Execution Permissions" }), functions.length > 0 ? (_jsx(Checkbox.Group, { value: value, onChange: handleChange, disabled: disabled, style: { width: "100%" }, children: _jsx(Space, { direction: "vertical", style: { width: "100%" }, children: functions.map((func) => (_jsx(Checkbox, { value: func, children: func }, func))) }) })) : (_jsx(Typography.Text, { type: "secondary", children: "No functions available for permission assignment" }))] }));
};
export default LogicPermissionsSection;
