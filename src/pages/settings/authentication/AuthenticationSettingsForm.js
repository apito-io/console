import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useMemo } from "react";
import { Button, Card, Form, Input, Radio, Switch, Typography, message, } from "antd";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../../contexts/AuthContext";
import { useGetProjectAuthenticationQuery, useUpdateProjectAuthenticationSettingsMutation, } from "../../../generated_gql/tanstack-query";
import { settingsKeys } from "../../../lib/queryKeys";
const { Paragraph, Link } = Typography;
const OAuthDocHref = "https://developers.google.com/identity/protocols/oauth2/web-server#creatingclient";
const AuthenticationSettingsForm = () => {
    const [form] = Form.useForm();
    const queryClient = useQueryClient();
    const { decodeTokenData } = useAuth();
    const tokenData = decodeTokenData();
    const projectId = tokenData?.project_id ?? "";
    const { data, isLoading: loading } = useGetProjectAuthenticationQuery({ _id: projectId }, { enabled: Boolean(projectId) });
    const { mutateAsync: saveSettings, isPending: saving } = useUpdateProjectAuthenticationSettingsMutation({
        onSuccess: () => {
            message.success("Authentication settings saved");
            void queryClient.invalidateQueries({
                queryKey: settingsKeys.authentication(),
            });
        },
        onError: (e) => message.error(e instanceof Error
            ? e.message
            : "Failed to save authentication settings"),
    });
    const snapshot = data?.getProject?.authentication_settings;
    const initial = useMemo(() => {
        if (!snapshot) {
            return {
                enable_general_auth: true,
                enable_google_auth: false,
                general_authentication_method: "email",
                google_client_id: "",
                google_oauth_redirect_uri: "",
            };
        }
        return {
            enable_general_auth: Boolean(snapshot.enable_general_auth),
            enable_google_auth: Boolean(snapshot.enable_google_auth),
            general_authentication_method: snapshot.general_authentication_method || "email",
            google_client_id: snapshot.google_client_id ?? "",
            google_oauth_redirect_uri: snapshot.google_oauth_redirect_uri ?? "",
        };
    }, [snapshot]);
    useEffect(() => {
        form.setFieldsValue(initial);
    }, [form, initial]);
    const onFinish = async (values) => {
        const input = {
            enable_general_auth: Boolean(values.enable_general_auth),
            enable_google_auth: Boolean(values.enable_google_auth),
            general_authentication_method: String(values.general_authentication_method || "email"),
            google_client_id: String(values.google_client_id ?? "").trim(),
            google_oauth_redirect_uri: String(values.google_oauth_redirect_uri ?? "").trim(),
        };
        const secret = String(values.google_client_secret ?? "").trim();
        if (secret !== "") {
            input.google_client_secret = secret;
        }
        await saveSettings({ input });
    };
    return (_jsx("div", { style: { maxWidth: "800px" }, children: _jsxs(Form, { form: form, layout: "vertical", onFinish: onFinish, disabled: loading && !snapshot, children: [_jsxs(Card, { title: "General sign-in", style: { marginBottom: 16 }, children: [_jsx(Form.Item, { name: "enable_general_auth", label: "Enable password sign-in", valuePropName: "checked", children: _jsx(Switch, {}) }), _jsx(Form.Item, { name: "general_authentication_method", label: "Sign-in identifier", children: _jsxs(Radio.Group, { children: [_jsx(Radio, { value: "email", children: "Email" }), _jsx(Radio, { value: "phone", children: "Phone" })] }) }), _jsx(Paragraph, { type: "secondary", style: { marginBottom: 0 }, children: "Users must have a bcrypt password set. Email mode matches the user email field; phone mode matches the phone field." })] }), _jsxs(Card, { title: "Google sign-in", style: { marginBottom: 16 }, children: [_jsx(Form.Item, { name: "enable_google_auth", label: "Enable Google", valuePropName: "checked", children: _jsx(Switch, {}) }), _jsx(Form.Item, { name: "google_client_id", label: "OAuth client ID", children: _jsx(Input, { placeholder: "e.g. xxx.apps.googleusercontent.com" }) }), _jsx(Form.Item, { name: "google_oauth_redirect_uri", label: "Authorized redirect URI", extra: "Must match exactly one URI in Google Cloud Console \u2192 Credentials \u2192 your OAuth client \u2192 Authorized redirect URIs.", children: _jsx(Input, { placeholder: "https://your-app.example.com/auth/google/callback" }) }), _jsx(Form.Item, { name: "google_client_secret", label: "OAuth client secret", extra: snapshot?.has_google_client_secret
                                ? "Leave blank to keep the existing secret."
                                : "Required for first-time configuration when Google is enabled.", children: _jsx(Input.Password, { placeholder: "Leave blank to keep existing" }) }), _jsx(Link, { href: OAuthDocHref, target: "_blank", rel: "noreferrer", children: "Google OAuth client setup" })] }), _jsx(Button, { type: "primary", htmlType: "submit", loading: saving, children: "Save" })] }) }));
};
export default AuthenticationSettingsForm;
