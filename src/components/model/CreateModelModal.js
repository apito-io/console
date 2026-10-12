import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Modal, Form, Input, Switch, message } from "antd";
import { useQueryClient } from "@tanstack/react-query";
import { canonicalizeModelName } from "../../utils/apitoNaming";
import { useCreateModelMutation } from "../../generated_gql/tanstack-query";
import { useTourTracking } from "../../hooks/useTourTracking";
import ModelNamePreview from "./ModelNamePreview";
import { useConsoleExtensions } from "../../contexts/ConsoleExtensionsContext";
import { invalidateModelQueries } from "../../lib/schemaCache";
const CreateModelModal = ({ visible, onCancel, onSuccess, }) => {
    const [form] = Form.useForm();
    const queryClient = useQueryClient();
    const { trackModelCreated } = useTourTracking();
    const { onSchemaMutationCompleted } = useConsoleExtensions();
    const { mutateAsync: createModelMutation, isPending: loading } = useCreateModelMutation();
    const handleSubmit = async (values) => {
        try {
            const canonicalName = canonicalizeModelName(values.name);
            const result = await createModelMutation({
                name: canonicalName,
                single_record: values.singleRecord || false,
            });
            if (result.addModelToProject) {
                message.success(`Model "${canonicalName}" created successfully`);
                await invalidateModelQueries(queryClient);
                form.resetFields();
                localStorage.removeItem("tour-waiting-for-model");
                trackModelCreated();
                onSuccess();
                await onSchemaMutationCompleted?.();
            }
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Failed to create model";
            message.error(errorMessage);
        }
    };
    const handleCancel = () => {
        form.resetFields();
        if (localStorage.getItem("tour-waiting-for-model") === "true") {
            localStorage.removeItem("tour-waiting-for-model");
            sessionStorage.setItem("tour-should-restart", "true");
        }
        onCancel();
    };
    return (_jsx(Modal, { title: "Create New Model", open: visible, onCancel: handleCancel, onOk: () => form.submit(), confirmLoading: loading, destroyOnClose: true, width: 480, children: _jsxs(Form, { form: form, layout: "vertical", onFinish: handleSubmit, preserve: false, children: [_jsx(Form.Item, { name: "name", label: "Model Name", rules: [
                        { required: true, message: "Please enter a model name" },
                        { min: 2, message: "Model name must be at least 2 characters" },
                        { max: 50, message: "Model name must be at most 50 characters" },
                        {
                            validator: async (_, value) => {
                                if (!value || typeof value !== "string")
                                    return;
                                try {
                                    canonicalizeModelName(value);
                                }
                                catch (e) {
                                    throw new Error(e instanceof Error ? e.message : "Invalid model name");
                                }
                            },
                        },
                    ], children: _jsx(Input, { placeholder: "e.g. food order, food_order, or foodOrder", autoFocus: true }) }), _jsx(Form.Item, { shouldUpdate: true, noStyle: true, children: () => {
                        const raw = form.getFieldValue("name");
                        return _jsx(ModelNamePreview, { rawName: raw });
                    } }), _jsx(Form.Item, { name: "singleRecord", label: "Single Record Model", valuePropName: "checked", extra: "If enabled, this model will only store a single record (useful for settings, configuration, etc.)", children: _jsx(Switch, {}) })] }) }));
};
export default CreateModelModal;
