import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useMemo } from "react";
import { Button, Card, Form, Input, Radio, Switch, Typography, message, } from "antd";
import { useAuth } from "../../../contexts/AuthContext";
import { useGetProjectStorageQuery, useUpdateProjectStorageSettingsMutation, } from "../../../generated_gql/tanstack-query";
import { settingsKeys } from "../../../lib/queryKeys";
import { useQueryClient } from "@tanstack/react-query";
const { Paragraph, Title } = Typography;
const StorageSettingsPage = () => {
    const [form] = Form.useForm();
    const queryClient = useQueryClient();
    const { decodeTokenData } = useAuth();
    const tokenData = decodeTokenData();
    const projectId = tokenData?.project_id ?? "";
    const { data, isLoading: loading } = useGetProjectStorageQuery({ _id: projectId }, { enabled: Boolean(projectId) });
    const { mutateAsync: saveSettings, isPending: saving } = useUpdateProjectStorageSettingsMutation({
        onSuccess: () => {
            message.success("Storage settings saved");
            void queryClient.invalidateQueries({
                queryKey: settingsKeys.storage(),
            });
            if (projectId) {
                void queryClient.invalidateQueries({
                    queryKey: useGetProjectStorageQuery.getKey({ _id: projectId }),
                });
            }
        },
        onError: (e) => message.error(e instanceof Error ? e.message : "Failed to save storage settings"),
    });
    const snapshot = data?.getProject?.storage_settings;
    const initial = useMemo(() => {
        const useFree = snapshot?.use_free_cloud_storage ?? true;
        return {
            storage_mode: (useFree ? "free" : "custom"),
            endpoint: snapshot?.endpoint ?? "",
            region: snapshot?.region ?? "",
            bucket: snapshot?.bucket ?? "",
            access_key_id: snapshot?.access_key_id ?? "",
            public_base_url: snapshot?.public_base_url ?? "",
            force_path_style: Boolean(snapshot?.force_path_style),
        };
    }, [snapshot]);
    useEffect(() => {
        form.setFieldsValue(initial);
    }, [form, initial]);
    const storageMode = Form.useWatch("storage_mode", form);
    const isFreeMode = storageMode !== "custom";
    const onFinish = async (values) => {
        const mode = String(values.storage_mode || "free");
        const useFree = mode === "free";
        if (useFree) {
            await saveSettings({
                input: { use_free_cloud_storage: true },
            });
            return;
        }
        const endpoint = String(values.endpoint ?? "").trim();
        const bucket = String(values.bucket ?? "").trim();
        const accessKeyId = String(values.access_key_id ?? "").trim();
        const secret = String(values.secret_access_key ?? "").trim();
        if (!endpoint || !bucket || !accessKeyId) {
            message.error("Endpoint, bucket, and access key are required for custom storage.");
            return;
        }
        if (!snapshot?.has_secret_access_key && !secret) {
            message.error("Secret access key is required for first-time custom storage setup.");
            return;
        }
        const input = {
            use_free_cloud_storage: false,
            endpoint,
            bucket,
            access_key_id: accessKeyId,
            region: String(values.region ?? "").trim() || null,
            public_base_url: String(values.public_base_url ?? "").trim() || null,
            force_path_style: Boolean(values.force_path_style),
        };
        if (secret !== "") {
            input.secret_access_key = secret;
        }
        await saveSettings({ input });
    };
    return (_jsxs("div", { style: { maxWidth: "800px", margin: "0 auto" }, children: [_jsx(Title, { level: 4, style: { marginBottom: 8 }, children: "Storage" }), _jsx(Paragraph, { type: "secondary", style: { marginBottom: 24 }, children: "Choose where project media uploads are stored. Use Apito free cloud storage or bring your own S3-compatible bucket (AWS S3, MinIO, R2, etc.)." }), _jsxs(Form, { form: form, layout: "vertical", onFinish: onFinish, disabled: loading && !snapshot, children: [_jsxs(Card, { title: "Upload backend", style: { marginBottom: 16 }, children: [_jsx(Form.Item, { name: "storage_mode", label: "Storage provider", children: _jsxs(Radio.Group, { children: [_jsx(Radio, { value: "free", children: "Use Apito free cloud storage" }), _jsx(Radio, { value: "custom", children: "Custom S3-compatible storage" })] }) }), isFreeMode ? (_jsx(Paragraph, { type: "secondary", style: { marginBottom: 0 }, children: "Uploads use the platform Cloudflare R2 bucket configured on the engine. No per-project S3 credentials are stored. Free cloud projects share a 500 MB storage quota per project." })) : null] }), _jsxs(Card, { title: "S3-compatible credentials", style: { marginBottom: 16 }, styles: { body: isFreeMode ? { opacity: 0.55 } : undefined }, children: [_jsx(Form.Item, { name: "endpoint", label: "Endpoint", rules: isFreeMode
                                    ? []
                                    : [{ required: true, message: "Endpoint is required" }], children: _jsx(Input, { disabled: isFreeMode, placeholder: "https://s3.amazonaws.com or https://minio.example.com" }) }), _jsx(Form.Item, { name: "region", label: "Region", children: _jsx(Input, { disabled: isFreeMode, placeholder: "e.g. us-east-1" }) }), _jsx(Form.Item, { name: "bucket", label: "Bucket", rules: isFreeMode
                                    ? []
                                    : [{ required: true, message: "Bucket is required" }], children: _jsx(Input, { disabled: isFreeMode, placeholder: "my-uploads" }) }), _jsx(Form.Item, { name: "access_key_id", label: "Access key ID", rules: isFreeMode
                                    ? []
                                    : [{ required: true, message: "Access key is required" }], children: _jsx(Input, { disabled: isFreeMode, placeholder: "AKIA..." }) }), _jsx(Form.Item, { name: "secret_access_key", label: "Secret access key", extra: snapshot?.has_secret_access_key
                                    ? "Leave blank to keep the existing secret."
                                    : "Required when configuring custom storage for the first time.", children: _jsx(Input.Password, { disabled: isFreeMode, placeholder: "Leave blank to keep existing" }) }), _jsx(Form.Item, { name: "public_base_url", label: "Public base URL (optional)", children: _jsx(Input, { disabled: isFreeMode, placeholder: "https://cdn.example.com" }) }), _jsx(Form.Item, { name: "force_path_style", label: "Force path-style URLs", valuePropName: "checked", extra: "Enable for MinIO and some S3-compatible providers.", children: _jsx(Switch, { disabled: isFreeMode }) })] }), _jsx(Button, { type: "primary", htmlType: "submit", loading: saving, children: "Save" })] })] }));
};
export default StorageSettingsPage;
