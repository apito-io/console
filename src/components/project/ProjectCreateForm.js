import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useMemo } from "react";
import { Form, Input, Row, Col, Segmented, Typography } from "antd";
import { httpService } from "../../services/httpService";
import { PROJECT_NAME_CHECK } from "../../constants/api";
import debounce from "lodash/debounce";
const generateRandomId = (length) => {
    const characters = "0123456789abcdefghijklmnopqrstuvwxyz";
    let result = "";
    for (let i = 0; i < length; i += 1) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
};
const normalizeName = (value) => value
    .trim()
    .replace(/[\s-]+/g, "_")
    .replace(/([a-z0-9])([A-Z])/g, "$1_$2")
    .replace(/([A-Z])([A-Z][a-z])/g, "$1_$2")
    .replace(/[^0-9a-zA-Z_]+/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_+|_+$/g, "")
    .toLowerCase();
const makeProjectIdFromName = (name) => `${normalizeName(name).toLowerCase()}_${generateRandomId(5)}`;
const { Text } = Typography;
const ProjectCreateForm = ({ form, isValidId, onValidIdChange, projectType, onProjectTypeChange, }) => {
    const debouncedCheck = useMemo(() => debounce(async (id) => {
        try {
            await httpService.post(PROJECT_NAME_CHECK, { name: id, id });
            onValidIdChange(true);
        }
        catch {
            onValidIdChange(false);
        }
    }, 1000), [onValidIdChange]);
    const watchedName = Form.useWatch("name", form);
    /** Keeps project id + availability check in sync whenever `name` changes (typing or e.g. template fill). */
    useEffect(() => {
        const value = typeof watchedName === "string" ? watchedName.trim() : "";
        if (!value) {
            form.setFieldsValue({ id: undefined });
            onValidIdChange(null);
            return;
        }
        const newId = makeProjectIdFromName(value);
        form.setFieldsValue({ id: newId });
        debouncedCheck(newId);
    }, [watchedName, debouncedCheck, form, onValidIdChange]);
    useEffect(() => {
        return () => {
            debouncedCheck.cancel();
        };
    }, [debouncedCheck]);
    const showProjectType = projectType !== undefined && onProjectTypeChange !== undefined;
    return (_jsx(_Fragment, { children: _jsxs(Row, { gutter: [16, 16], children: [showProjectType && (_jsx(Col, { span: 24, children: _jsxs(Form.Item, { label: "Project type", required: true, children: [_jsx(Segmented, { block: true, value: projectType, onChange: (v) => onProjectTypeChange(v), options: [
                                    { label: "General", value: "general" },
                                    { label: "SaaS (multi-tenant)", value: "saas" },
                                ] }), _jsx(Text, { type: "secondary", style: { display: "block", marginTop: 8 }, children: "SaaS projects are multi-tenant; you choose shared tables vs a separate database per tenant in the next step." })] }) })), _jsx(Col, { span: 24, children: _jsx(Form.Item, { name: "name", label: "Project Name", rules: [
                            { required: true, message: "Please enter a project name" },
                            {
                                min: 3,
                                message: "Project name must be at least 3 characters",
                            },
                            {
                                max: 50,
                                message: "Project name must be less than 50 characters",
                            },
                            {
                                pattern: /^[a-zA-Z0-9\s-_]+$/,
                                message: "Project name can only contain letters, numbers, spaces, hyphens, and underscores",
                            },
                        ], children: _jsx(Input, { placeholder: "Enter your project name", size: "large" }) }) }), _jsx(Col, { span: 24, children: _jsx(Form.Item, { name: "id", label: "Project ID", rules: [{ required: true, message: "Project ID is required" }], hasFeedback: true, validateStatus: isValidId === null ? "" : isValidId ? "success" : "error", help: isValidId === false
                            ? "This project ID is already taken. Please adjust the name."
                            : undefined, children: _jsx(Input, { readOnly: true, 
                            //disabled
                            placeholder: "Generated from project name" }) }) }), _jsx(Col, { span: 24, children: _jsx(Form.Item, { name: "description", label: "Description (Optional)", children: _jsx(Input.TextArea, { placeholder: "Describe your project...", rows: 3, maxLength: 200, showCount: true }) }) })] }) }));
};
export default ProjectCreateForm;
